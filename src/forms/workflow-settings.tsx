import { invoke } from "@tauri-apps/api";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { UserConfig } from "../Config";
import useWarningOnExit from "../hooks/use-warning-on-unload";
import { Commands, getConfig } from "../utils";
import WorkflowArray from "./workflow-array";
import { DevTool } from "@hookform/devtools";
import { useEffect } from "react";

const WorkflowSettings = () => {
  const formMethods = useForm<UserConfig>({
    defaultValues: async () => {
      const data = await getConfig();
      return data.user_config;
    },
  });

  const { isDirty } = useFormState({ control: formMethods.control });

  const onSubmit = (callback?: () => void) =>
    formMethods.handleSubmit(
      (data: UserConfig) => {
        invoke(Commands.SaveUserConfig, { config: data }).then((res) => {
          console.log(res);
          callback && callback();
        });
      },
      (e) => console.log("error", e)
    );

  useWarningOnExit(isDirty);

  const {
    reset,
    formState: { isSubmitSuccessful },
  } = formMethods;

  useEffect(() => {
    const updateForm = async () => {
      const data = await getConfig();
      reset(data.user_config);
    };
    if (isSubmitSuccessful) {
      updateForm();
    }
  }, [reset, isSubmitSuccessful]);

  return (
    <FormProvider {...formMethods}>
      <form id="workflow-settings" onSubmit={onSubmit()}>
        <WorkflowArray onSubmit={onSubmit} />

        <DevTool control={formMethods.control} />
      </form>
    </FormProvider>
  );
};

export default WorkflowSettings;
