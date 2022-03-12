import { invoke } from "@tauri-apps/api";
import { debounce } from "lodash";
import { useState, useEffect, useCallback } from "react";
import { useForm, useFormState } from "react-hook-form";
import { Workflows } from "../Config";
import { Commands, getConfig } from "../utils";
import WorkflowArray from "./workflow-array";

const WorkflowSettings = () => {
  // const [pathFromFile, setPathFromFile] = useState<string | undefined>();

  const [defaultValues, setDefaultValues] = useState<Workflows | undefined>();

  useEffect(() => {
    getConfig().then((data) => setDefaultValues(data));
  }, []);

  const { control, register, handleSubmit, getValues, setValue, reset } =
    useForm<Workflows>({
      defaultValues,
    });
  const { isDirty, isValid, isSubmitting } = useFormState({ control });
  console.log("render");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onSubmit = useCallback(
    handleSubmit((data: Workflows) => {
      invoke(Commands.SaveWorkflows, { config: data });
    }),
    [reset, handleSubmit]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSubmit = useCallback(debounce(onSubmit, 1200), []);

  useEffect(() => {
    if (isDirty && isValid) {
      debouncedSubmit();
    }
  }, [isDirty, isValid, debouncedSubmit]);

  //
  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={onSubmit}>
      <WorkflowArray
        {...{ control, register, defaultValues, getValues, setValue }}
      />
    </form>
  );
};

export default WorkflowSettings;
