import { SettingsFormData, settingsSchema } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { CustomFormField } from "./form-field";
import { Button } from "./ui/button";
import { Form } from "./ui/form";

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
    <div className="pt-8 pb-5 px-4 md:px-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">
          Cài đặt tài khoản
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Quản lý thông tin cá nhân và tùy chỉnh tài khoản của bạn
        </p>
      </div>
      <div className="bg-background rounded-lg p-6 shadow border border-border">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <CustomFormField
              name="name"
              label="Họ và tên"
              disabled={!editMode}
            />
            <CustomFormField
              name="email"
              label="Email"
              type="email"
              disabled={!editMode}
            />
            <CustomFormField
              name="avatarUrl"
              label="Ảnh đại diện (URL)"
              type="text"
              disabled={!editMode}
            />
            <CustomFormField name="role" label="Vai trò" type="text" disabled />

            <div className="pt-4 flex flex-col sm:flex-row sm:justify-between gap-2">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={toggleEditMode}
                  className="min-w-[100px]"
                >
                  {editMode ? "Hủy" : "Chỉnh sửa"}
                </Button>
                {editMode && (
                  <Button
                    type="submit"
                    variant="default"
                    className="min-w-[120px]"
                  >
                    Lưu thay đổi
                  </Button>
                )}
              </div>
              {userType === "USER" && onRequestAuthor && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onRequestAuthor}
                  disabled={isRequestingAuthor}
                  aria-busy={isRequestingAuthor}
                  className="min-w-[160px]"
                >
                  {isRequestingAuthor
                    ? "Đang gửi yêu cầu..."
                    : "Yêu cầu quyền Tác giả"}
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
