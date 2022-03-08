import { useFieldArray, UseFieldArrayRemove } from "react-hook-form";
import type { useForm } from "react-hook-form";

type Props = {
  nestIndex: number;
  nestedRemove: UseFieldArrayRemove;
} & Pick<ReturnType<typeof useForm>, "control" | "register">;

const WorkflowAction = ({
  nestIndex,
  control,
  register,
  nestedRemove,
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
