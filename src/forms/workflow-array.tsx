import { useFieldArray, useForm } from "react-hook-form";
import { defaultWorkflow } from "../Config";
import WorkflowAction from "./workflow-action";

export type NestedInputProps = Pick<
  ReturnType<typeof useForm>,
  "control" | "register" | "getValues" | "setValue"
>;
export default function WorkflowArray({
  control,
  register,
  getValues,
  setValue,
}: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workflows",
  });

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id} className="workflow">
              <label>Name</label>
              <input {...register(`workflows.${index}.name`)} />

              <WorkflowAction
                nestIndex={index}
                {...{ control, register, getValues, setValue }}
                nestedRemove={remove}
              />
            </li>
          );
        })}
      </ul>

      <section>
        <button
          type="button"
          onClick={() => {
            append(defaultWorkflow);
          }}
        >
          Add Workflow
        </button>
      </section>
    </>
  );
}
