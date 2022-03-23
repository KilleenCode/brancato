import { useFieldArray, UseFieldArrayRemove } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { NestedInputProps } from "./workflow-array";

type Props = {
  nestIndex: number;
  nestedRemove: UseFieldArrayRemove;
} & NestedInputProps;

const WorkflowAction = ({
  nestIndex,
  control,
  register,
  nestedRemove,
  getValues,
  setValue,
}: Props) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `workflows.${nestIndex}.steps`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        const fieldName = `workflows.${nestIndex}.steps.${k}.value`;
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <label htmlFor={item.id}>Path</label>
            <input
              id={item.id}
              {...register(fieldName, {
                required: true,
              })}
              style={{ marginRight: "25px" }}
            />
            <button
              type="button"
              onClick={() => {
                let value = getValues(fieldName) as string;
                let defaultPath = value && value.length > 0 ? value : undefined;
                invoke("select_file", { defaultPath }).then(
                  (value) => value && setValue(fieldName, value)
                );
              }}
            >
              Folder Path
            </button>

            <button type="button" onClick={() => remove(k)}>
              Delete
            </button>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ value: "" })}>
        Add Step
      </button>
      <button type="button" onClick={() => nestedRemove(nestIndex)}>
        Delete Workflow
      </button>
    </div>
  );
};

export default WorkflowAction;
