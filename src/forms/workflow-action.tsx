import { useFieldArray, UseFieldArrayRemove } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { NestedInputProps } from "./workflow-array";
import { Input, InputContainer, InputLabel } from "../components/core/input";
import { styled } from "../theme";
import Button, { ButtonContainer } from "../components/core/button";

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
            <InputContainer>
              <InputLabel htmlFor={item.id}>Path</InputLabel>
              <WorkflowActions>
                <Input
                  id={item.id}
                  {...register(fieldName, {
                    required: true,
                  })}
                  style={{ marginRight: "25px" }}
                />
                <ButtonContainer
                  layout="pills"
                  css={{ display: "inline-flex", marginTop: 0 }}
                >
                  <Button
                    appearance="secondary"
                    type="button"
                    onClick={() => {
                      let value = getValues(fieldName) as string;
                      let defaultPath =
                        value && value.length > 0 ? value : undefined;
                      invoke("select_file", { defaultPath }).then(
                        (value) => value && setValue(fieldName, value)
                      );
                    }}
                  >
                    Folder Path
                  </Button>
                  <Button
                    appearance="danger"
                    type="button"
                    onClick={() => remove(k)}
                  >
                    Delete
                  </Button>
                </ButtonContainer>
              </WorkflowActions>
            </InputContainer>
          </div>
        );
      })}
      <ButtonContainer>
        <Button type="button" onClick={() => append({ value: "" })}>
          Add Step
        </Button>
        <Button
          appearance="danger"
          type="button"
          onClick={() => nestedRemove(nestIndex)}
        >
          Delete Workflow
        </Button>
      </ButtonContainer>
    </div>
  );
};

const WorkflowActions = styled("div", {});

export default WorkflowAction;
