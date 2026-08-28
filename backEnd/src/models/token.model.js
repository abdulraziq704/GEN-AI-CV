import mongoose, { Schema } from "mongoose";

const refreshTokenSchema = new Schema(
  {
    hashedToken: {
      type: String,
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    family: {
      type: String,       // groups related rotated tokens together
      required: true,
    },
    isUsed: {
      type: Boolean,
      default: false,     // flips to true once rotated/replaced
    },
    isRevoked: {
      type: Boolean,
      default: false,     // manually revoked (logout, reuse detected)
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// Auto-delete expired tokens from DB (MongoDB TTL index)
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const RefreshToken = mongoose.model("RefreshToken", refreshTokenSchema);
export default RefreshToken;