import { useController, useFieldArray, useForm, useFormContext } from "react-hook-form";
import Button, { ButtonContainer } from "../components/core/button";
import { Input, InputContainer, InputLabel } from "../components/core/input";
import { defaultWorkflow } from "../Config";
import { styled } from "../theme";
import WorkflowAction from "./workflow-action";

export type NestedInputProps = Pick<
  ReturnType<typeof useForm>,
  "control" | "register" | "getValues" | "setValue"
>;
export default function WorkflowArray() {
  const { fields, prepend, remove } = useFieldArray({

    name: "workflows",
  });

  const { register, getValues, control, setValue, formState: { isSubmitting } } = useFormContext()
  return (
    <WorkflowColumns>
      <EndColumn>
        <FormControls align="end">
          <Button
            type="button"
            onClick={() => {
              prepend(defaultWorkflow);
            }}
          >
            Add Workflow
          </Button>
          <Button appearance="success" disabled={isSubmitting}>
            Save
          </Button>
        </FormControls>
      </EndColumn>
      <ul style={{ margin: 0 }}>
        {fields.map((item, index) => {
          return (
            <StartColumn key={item.id} className="workflow">
              <InputContainer>
                <InputLabel>Name</InputLabel>
                <Input {...register(`workflows.${index}.name`)} />
              </InputContainer>
              <InputContainer>
                <InputLabel>Arguments (optional)</InputLabel>
                <p style={{ margin: 0, padding: 0, fontSize: '0.8rem' }}>A comma-separated list of argument names, to start</p>
                <StringArrayInput name={`workflows.${index}.arguments`} />
              </InputContainer>
              <WorkflowAction
                nestIndex={index}
                {...{ control, register, getValues, setValue }}
                nestedRemove={remove}
              />
            </StartColumn>
          );
        })}
      </ul>
    </WorkflowColumns>
  );
}

const StringArrayInput = ({ name }: { name: string }) => {
  const { field: { onChange, ...field } } = useController({
    name: name
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(',').map(e => e.trim())
    onChange(value)
  }

  return <Input {...field} onChange={handleChange} />

}

const WorkflowColumns = styled("div", {
  display: "grid",
  gridTemplateAreas: `"form controls"`,
  gridTemplateColumns: "2fr 1fr",
});

const FormControls = styled(ButtonContainer, {
  position: "sticky",
  top: 0,
  padding: "1rem",
});
const EndColumn = styled("div", { gridArea: "controls" });
const StartColumn = styled("li", {
  padding: "2rem",
  borderBottom: "1px solid $mauve6",
  gridArea: "form",
});
