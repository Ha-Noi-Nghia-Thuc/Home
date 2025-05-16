import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "./ui/form";
import { Button } from "./ui/button";
import { CustomFormField } from "./form-field";

const SettingsForm = ({
  initialData,
  onSubmit,
  userType,
  onRequestAuthor,
  isRequestingAuthor,
}: SettingsFormProps) => {
  const [editMode, setEditMode] = useState(false);
  const form = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: initialData,
  });

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (editMode) {
      form.reset(initialData);
    }
  };

  const handleSubmit = async (data: SettingsFormData) => {
    await onSubmit(data);
    setEditMode(false);
  };

  return (
    <div className="pt-8 pb-5 px-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">
          {`${userType.charAt(0).toUpperCase() + userType.slice(1)} Settings`}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and personal information
        </p>
      </div>
      <div className="bg-white rounded-xl p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField name="name" label="Name" disabled={!editMode} />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />
            <CustomFormField
              name="avatarUrl"
              label="Avatar URL"
              type="text"
              disabled={!editMode}
            />
            <CustomFormField name="role" label="Role" type="text" disabled />

            <div className="pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  onClick={toggleEditMode}
                  className="bg-secondary-500 text-white hover:bg-secondary-600"
                >
                  {editMode ? "Cancel" : "Edit"}
                </Button>
                {editMode && (
                  <Button
                    type="submit"
                    className="bg-primary-700 text-white hover:bg-primary-800"
                  >
                    Save Changes
                  </Button>
                )}
              </div>
              {userType === "USER" && onRequestAuthor && (
                <Button
                  type="button"
                  onClick={onRequestAuthor}
                  className="bg-yellow-600 text-white hover:bg-yellow-700"
                  disabled={isRequestingAuthor}
                >
                  {isRequestingAuthor ? "Requesting..." : "Request Author Role"}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default SettingsForm;
