import { useFieldArray } from "react-hook-form";
import { defaultWorkflow } from "../Config";
import WorkflowAction from "./workflow-action";

export default function WorkflowArray({ control, register }: any) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: "workflows",
  });

  return (
    <>
      <ul>
        {fields.map((item, index) => {
          return (
            <li key={item.id}>
              <label>Name</label>
              <input {...register(`workflows.${index}.name`)} />

              <button type="button" onClick={() => remove(index)}>
                Delete
              </button>
              <WorkflowAction nestIndex={index} {...{ control, register }} />
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
          append
        </button>
      </section>
    </>
  );
}
