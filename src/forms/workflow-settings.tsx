import { invoke } from "@tauri-apps/api";
import { useState, useEffect } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Workflows } from "../Config";
import useWarningOnExit from "../hooks/use-warning-on-unload";
import { Commands, getConfig } from "../utils";
import WorkflowArray from "./workflow-array";

const WorkflowSettings = () => {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();

  const [defaultValues, setDefaultValues] = useState<Workflows | undefined>();

  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<Workflows>({
      defaultValues,
    });
  const { isDirty, isSubmitting } = useFormState({ control });

  useEffect(() => {
    getConfig().then((data) => setDefaultValues(data));
  }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = (data: Workflows) => {
    invoke(Commands.SaveWorkflows, { config: data });
  };

  useWarningOnExit(isDirty);
  //
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <WorkflowArray
        {...{ control, register, defaultValues, getValues, setValue }}
      />
      <button disabled={isSubmitting}>Save</button>
    </form>
  );
};

export default WorkflowSettings;
