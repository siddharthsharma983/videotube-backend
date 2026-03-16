import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import redis from "../utils/redis.js";

// Get All Videos (Redis Cache)
const getAllVideos = asyncHandler(async (req, res) => {
  const cacheKey = "videos:all";

  const cachedVideos = redis ? await redis.get(cacheKey) : null;

  if (cachedVideos) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cachedVideos),
          "Videos fetched from cache"
        )
      );
  }

  const videos = await Video.find()
    .sort({ createdAt: -1 })
    .populate("owner", "username avatar");

  if (redis) {
    await redis.set(cacheKey, JSON.stringify(videos), "EX", 60);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Videos fetched from database"));
});

// Publish Video
const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    throw new ApiError(400, "Title and description required");
  }

  const videoFileLocalPath = req.files?.videoFile?.[0]?.path;
  const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path;

  if (!videoFileLocalPath || !thumbnailLocalPath) {
    throw new ApiError(400, "Video file and thumbnail required");
  }

  const videoFile = await uploadOnCloudinary(videoFileLocalPath);
  const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

  if (!videoFile || !thumbnail) {
    throw new ApiError(500, "File upload failed");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnail.url,
    title,
    description,
    duration: videoFile.duration || 0,
    owner: req.user._id,
  });

  if (redis) {
    await redis.del("videos:all");
  }
  await redis.del("videos:trending");

  return res
    .status(201)
    .json(new ApiResponse(201, video, "Video published successfully"));
});

// Get Video By ID
const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "username avatar"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.views += 1;
  await video.save();

  return res.status(200).json(new ApiResponse(200, video, "Video fetched"));
});

// Search Videos
const searchVideos = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q) {
    throw new ApiError(400, "Search query required");
  }

  const videos = await Video.find({
    $text: { $search: q },
  }).populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Search results fetched"));
});

// Recommendation System
const getRecommendedVideos = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const videos = await Video.find({
    _id: { $ne: videoId },
    isPublished: true,
  })
    .sort({ views: -1 })
    .limit(10)
    .populate("owner", "username avatar");

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Recommended videos fetched"));
});

// Trending Videos (Redis Cache)
const getTrendingVideos = asyncHandler(async (req, res) => {
  const cacheKey = "videos:trending";

  const cachedTrending = await redis.get(cacheKey);

  if (cachedTrending) {
    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          JSON.parse(cachedTrending),
          "Trending videos from cache"
        )
      );
  }

  const videos = await Video.find({
    isPublished: true,
  })
    .sort({ views: -1, createdAt: -1 })
    .limit(10)
    .populate("owner", "username avatar");

  await redis.set(cacheKey, JSON.stringify(videos), "EX", 60);

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Trending videos fetched"));
});

// Update Video
const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description } = req.body;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const thumbnailLocalPath = req.file?.path;

  const thumbnail = thumbnailLocalPath
    ? await uploadOnCloudinary(thumbnailLocalPath)
    : null;

  const video = await Video.findByIdAndUpdate(
    videoId,
    {
      $set: {
        title,
        description,
        ...(thumbnail && { thumbnail: thumbnail.url }),
      },
    },
    { new: true }
  );

  await redis.del("videos:all");
  await redis.del("videos:trending");

  return res.status(200).json(new ApiResponse(200, video, "Video updated"));
});

// Delete Video
const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  await Video.findByIdAndDelete(videoId);

  await redis.del("videos:all");
  await redis.del("videos:trending");

  return res.status(200).json(new ApiResponse(200, {}, "Video deleted"));
});

// Toggle Publish
const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video id");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  video.isPublished = !video.isPublished;

  await video.save();

  await redis.del("videos:all");
  await redis.del("videos:trending");

  return res
    .status(200)
    .json(new ApiResponse(200, video, "Publish status toggled"));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  searchVideos,
  getRecommendedVideos,
  getTrendingVideos,
};
