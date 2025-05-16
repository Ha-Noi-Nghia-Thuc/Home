"use client";

import SettingsForm from "@/components/settings-form";
import {
  useGetAuthUserQuery,
  useUpdateUserSettingsMutation,
  useRequestAuthorRoleMutation,
} from "@/store/api";
import React, { useState } from "react";
import { SettingsFormData } from "@/lib/schemas";

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
    return <>Loading...</>;
  }

  if (!authUser?.userInfo) {
    return <>User data not found.</>;
  }

  const initialData: SettingsFormData = {
    name: authUser.userInfo.name || "",
    email: authUser.userInfo.email || "",
    avatarUrl: authUser.userInfo.avatarUrl || "",
    role: authUser.userInfo.role || "USER",
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await updateUser({
      cognitoId: authUser.cognitoInfo.userId,
      ...data,
    });
  };

  const handleRequestAuthor = async () => {
    setAuthorRequestSuccess(null);
    setAuthorRequestError(null);
    try {
      await requestAuthorRole().unwrap();
      setAuthorRequestSuccess("Request to become an author sent successfully!");
    } catch (err: any) {
      setAuthorRequestError(
        err?.data?.message || err?.message || "Failed to send author request."
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
      {authorRequestSuccess && (
        <div className="text-green-600 mt-2">{authorRequestSuccess}</div>
      )}
      {authorRequestError && (
        <div className="text-red-600 mt-2">{authorRequestError}</div>
      )}
    </div>
  );
};

export default UserSettingsPage;
