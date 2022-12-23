import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import { FormProvider, useForm, useFormState } from "react-hook-form";
import { UserConfig } from "../Config";
import useWarningOnExit from "../hooks/use-warning-on-unload";
import { Commands, getConfig } from "../utils";
import WorkflowArray from "./workflow-array";

const WorkflowSettings = () => {
  const [defaultValues, setDefaultValues] = useState<UserConfig | undefined>();

  const formMethods = useForm<UserConfig>({
    defaultValues,
  });

  const { isDirty } = useFormState({ control: formMethods.control });
  useEffect(() => {
    console.log(isDirty);
  }, [isDirty]);
  useEffect(() => {

    getConfig().then((data) => setDefaultValues(data.user_config));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = (data: UserConfig) => {
    invoke(Commands.SaveUserConfig, { config: data }).then((res) =>
      console.log(res)
    );
  };


  useWarningOnExit(isDirty);

  useEffect(() => {
    formMethods.reset(defaultValues);
  }, [defaultValues, formMethods]);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(onSubmit, (e) => console.log(e))}
      >
        <WorkflowArray />
      </form>
    </FormProvider>
  );
};

export default WorkflowSettings;
