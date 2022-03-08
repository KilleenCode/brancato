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
            <li key={item.id} className="workflow">
              <label>Name</label>
              <input {...register(`workflows.${index}.name`)} />

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
          Add Workflow
        </button>
      </section>
    </>
  );
}
