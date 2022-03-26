import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { UserConfig } from "../Config";
import useWarningOnExit from "../hooks/use-warning-on-unload";
import { Commands, getConfig } from "../utils";
import WorkflowArray from "./workflow-array";

const WorkflowSettings = () => {
  const [defaultValues, setDefaultValues] = useState<UserConfig | undefined>();

  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<UserConfig>({
      defaultValues,
    });
  const { isDirty, isSubmitting } = useFormState({ control });

  useEffect(() => {
    getConfig().then((data) => setDefaultValues(data.user_config));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = (data: UserConfig) => {
    invoke(Commands.SaveUserConfig, { config: data });
  };

  useWarningOnExit(isDirty);

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <WorkflowArray
        {...{
          control,
          register,
          defaultValues,
          getValues,
          setValue,
          isSubmitting,
        }}
      />
    </form>
  );
};

export default WorkflowSettings;
