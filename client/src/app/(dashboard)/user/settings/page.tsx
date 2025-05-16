"use client";

import LoadingSpinner from "@/components/loading-spinner";
import SettingsForm from "@/components/settings-form";
import { SettingsFormData } from "@/lib/schemas";
import {
  useGetAuthUserQuery,
  useRequestAuthorRoleMutation,
  useUpdateUserSettingsMutation,
} from "@/store/api";
import React, { useState } from "react";

const UserSettingsPage = () => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const [updateUser] = useUpdateUserSettingsMutation();
  const [requestAuthorRole, { isLoading: isRequestingAuthor }] =
    useRequestAuthorRoleMutation();
  const [authorRequestSuccess, setAuthorRequestSuccess] = useState<
    string | null
  >(null);
  const [authorRequestError, setAuthorRequestError] = useState<string | null>(
    null
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!authUser?.userInfo) {
    return (
      <div className="text-center text-destructive mt-8" role="alert">
        Không tìm thấy thông tin người dùng.
      </div>
    );
  }

  const initialData: SettingsFormData = {
    name: authUser.userInfo.name || "",
    email: authUser.userInfo.email || "",
    avatarUrl: authUser.userInfo.avatarUrl || "",
    role: authUser.userInfo.role || "USER",
  };

  const handleSubmit = async (data: SettingsFormData) => {
    try {
      await updateUser({
        cognitoId: authUser.cognitoInfo.userId,
        ...data,
      }).unwrap();
      setAuthorRequestSuccess("Cập nhật thông tin thành công!");
      setAuthorRequestError(null);
    } catch (err: any) {
      setAuthorRequestError(
        err?.data?.message || err?.message || "Cập nhật thông tin thất bại."
      );
      setAuthorRequestSuccess(null);
    }
  };

  const handleRequestAuthor = async () => {
    setAuthorRequestSuccess(null);
    setAuthorRequestError(null);
    try {
      await requestAuthorRole().unwrap();
      setAuthorRequestSuccess(
        "Yêu cầu trở thành Tác giả đã được gửi thành công!"
      );
    } catch (err: any) {
      setAuthorRequestError(
        err?.data?.message ||
          err?.message ||
          "Gửi yêu cầu trở thành Tác giả thất bại."
      );
    }
  };

  return (
    <div>
      <SettingsForm
        initialData={initialData}
        onSubmit={handleSubmit}
        userType={authUser.userInfo.role}
        onRequestAuthor={handleRequestAuthor}
        isRequestingAuthor={isRequestingAuthor}
      />
      {(authorRequestSuccess || authorRequestError) && (
        <div
          className={`mt-4 px-4 py-2 rounded-lg text-sm font-medium ${
            authorRequestSuccess
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
          role="alert"
        >
          {authorRequestSuccess || authorRequestError}
        </div>
      )}
    </div>
  );
};

export default UserSettingsPage;
