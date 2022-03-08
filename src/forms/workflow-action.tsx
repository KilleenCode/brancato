import { useFieldArray } from "react-hook-form";
import type { useForm } from "react-hook-form";

type Props = {
  nestIndex: number;
} & Pick<ReturnType<typeof useForm>, "control" | "register">;

const WorkflowAction = ({ nestIndex, control, register }: Props) => {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `workflows.${nestIndex}.steps`,
  });

  return (
    <div>
      {fields.map((item, k) => {
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <label>File:</label>
            <input
              {...register(`workflows.${nestIndex}.steps.${k}.value`, {
                required: true,
              })}
              style={{ marginRight: "25px" }}
            />

            <button type="button" onClick={() => remove(k)}>
              Delete Nested
            </button>
          </div>
        );
      })}

      <button type="button" onClick={() => append({ value: "" })}>
        Append Nested
      </button>

      <hr />
    </div>
  );
};

export default WorkflowAction;
