import { useFieldArray, useFormContext } from "react-hook-form";
import { invoke } from "@tauri-apps/api";
import { Input, InputContainer, InputLabel } from "../components/core/input";
import { styled } from "../theme";
import Button, { ButtonContainer } from "../components/core/button";
import { DropdownMenuIcon, TrashIcon } from "@radix-ui/react-icons";
type Props = {
  nestIndex: number;
};

const WorkflowAction = ({ nestIndex }: Props) => {
  const { register, getValues, setValue } = useFormContext();
  const { fields, remove, append } = useFieldArray({
    name: `workflows.${nestIndex}.steps`,
  });

  return (
    <fieldset style={{ border: "1px solid #ccc" }}>
      <legend>Steps</legend>
      {fields.map((item, k) => {
        const fieldName = `workflows.${nestIndex}.steps.${k}.value`;
        return (
          <div key={item.id} style={{ marginLeft: 20 }}>
            <WorkflowActions>
              <InputContainer>
                <InputLabel htmlFor={item.id}>Path</InputLabel>
                <Input
                  id={item.id}
                  {...register(fieldName, {
                    required: true,
                    minLength: 1,
                  })}
                  style={{ marginRight: "25px" }}
                />
              </InputContainer>
              <ButtonContainer
                layout="pills"
                css={{ display: "inline-flex", marginTop: 0 }}
              >
                <Button
                  size="small"
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
                  <DropdownMenuIcon /> Folder Path
                </Button>
                <Button
                  size="small"
                  appearance="danger"
                  type="button"
                  onClick={() => remove(k)}
                >
                  <TrashIcon />
                  Delete step
                </Button>
              </ButtonContainer>
            </WorkflowActions>
          </div>
        );
      })}
      <ButtonContainer>
        <Button type="button" onClick={() => append({ value: "" })}>
          Add Step
        </Button>
      </ButtonContainer>
    </fieldset>
  );
};

const WorkflowActions = styled("div", {});

export default WorkflowAction;
