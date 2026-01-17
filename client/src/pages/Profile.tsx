import { useState, useRef } from "react";
import Layout from "../components/Layout";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { useUpdateProfileMutation, useGetCurrentUserQuery } from "../api/authApi";
import { setCredentials } from "../features/auth/authSlice";
import { Camera, User, Mail, Save } from "lucide-react";
import toast from "react-hot-toast";

export default function Profile() {
  const { user } = useAppSelector((s) => s.auth);
  const dispatch = useAppDispatch();
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();
  const { refetch } = useGetCurrentUserQuery();
  
  const [name, setName] = useState(user?.name || "");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get preview URL
  const getPreviewUrl = () => {
    if (selectedImage) {
      return URL.createObjectURL(selectedImage);
    }
    if (user?.profileImage) {
      if (user.profileImage.startsWith("http")) {
        return user.profileImage;
      }
      return `${import.meta.env.VITE_API_URL}${user.profileImage}`;
    }
    return null;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        return;
      }

      setSelectedImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      
      if (selectedImage) {
        formData.append("profileImage", selectedImage);
      }

      const response = await updateProfile(formData).unwrap();
      
      // Update Redux store with new user data
      dispatch(setCredentials(response.user));
      
      // Refetch to get latest data
      await refetch();
      
      toast.success("Profile updated successfully!");
      setSelectedImage(null);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to update profile");
    }
  };

  const getImageUrl = () => {
    const previewUrl = getPreviewUrl();
    if (previewUrl && imageError !== previewUrl) {
      return previewUrl;
    }
    if (user?.profileImage && imageError !== user.profileImage) {
      // If it's already a full URL (http/https), use it as is
      if (user.profileImage.startsWith("http")) {
        return user.profileImage;
      }
      // Otherwise, prepend API URL for local files
      return `${import.meta.env.VITE_API_URL}${user.profileImage}`;
    }
    return null;
  };

  const handleImageError = () => {
    if (user?.profileImage) {
      setImageError(user.profileImage);
    }
  };

  return (
    <Layout title="Profile Settings">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Edit Profile</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Profile Image Section */}
            <div className="flex flex-col items-center mb-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 bg-gray-100 flex items-center justify-center">
                  {getImageUrl() ? (
                    <img
                      src={getImageUrl() || undefined}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={handleImageError}
                    />
                  ) : (
                    <User className="w-16 h-16 text-gray-400" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-full shadow-lg transition-colors"
                >
                  <Camera className="w-5 h-5" />
                </button>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <p className="text-sm text-gray-500 mt-2">
                Click the camera icon to upload a profile picture
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Max size: 5MB (JPEG, PNG, GIF, WebP)
              </p>
            </div>

            {/* Name Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
              </label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
              <p className="text-xs text-gray-400 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Role Field (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={user?.role ? user.role.charAt(0).toUpperCase() + user.role.slice(1) : ""}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="w-5 h-5" />
                {isLoading ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

