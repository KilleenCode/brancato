import { useFieldArray, useForm } from "react-hook-form";
import Button, { ButtonContainer } from "../components/core/button";
import { Input, InputContainer, InputLabel } from "../components/core/input";
import { defaultWorkflow } from "../Config";
import { styled } from "../theme";
import WorkflowAction from "./workflow-action";
import * as Dialog from "@radix-ui/react-dialog";

export type NestedInputProps = Pick<
  ReturnType<typeof useForm>,
  "control" | "register" | "getValues" | "setValue"
>;
export default function WorkflowArray({
  control,
  register,
  getValues,
  setValue,
  isSubmitting,
}: any) {
  const { fields, prepend, remove } = useFieldArray({
    control,
    name: "workflows",
  });

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
          let workflowName = getValues().workflows[index].name;

          return (
            <>
              <h2>{workflowName}</h2>
              <Dialog.Root>
                <Dialog.Trigger>Edit {workflowName}</Dialog.Trigger>
                <Dialog.Portal>
                  <Overlay />
                  <Content>
                    <Dialog.Title>Add Workflow</Dialog.Title>
                    <Dialog.Description>A Description</Dialog.Description>
                    <StartColumn key={item.id} className="workflow">
                      <InputContainer>
                        <InputLabel>Name</InputLabel>
                        <Input {...register(`workflows.${index}.name`)} />
                      </InputContainer>
                      <WorkflowAction
                        nestIndex={index}
                        {...{ control, register, getValues, setValue }}
                        nestedRemove={remove}
                      />
                    </StartColumn>
                    <Dialog.Close>X</Dialog.Close>
                  </Content>
                </Dialog.Portal>
              </Dialog.Root>
            </>
          );
        })}
      </ul>
    </WorkflowColumns>
  );
}

const Overlay = styled(Dialog.Overlay, {
  background: "$mauve2",
  opacity: 0.4,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  display: "grid",
  placeItems: "center",
  overflowY: "auto",
});

const Content = styled(Dialog.Content, {
  boxShadow:
    "hsl(206 22% 7% / 35%) 0px 10px 38px -10px, hsl(206 22% 7% / 20%) 0px 10px 20px -15px",

  maxWidth: "450px",
  maxHeight: "85vh",
  padding: 30,
  borderRadius: 4,
  backgroundColor: "white",
  position: "fixed",
  top: "10vh",
  height: "60vh",
  overflowY: "scroll",
  left: "5%",
  right: "5%",
});

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
