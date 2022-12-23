import * as Popover from "../components/core/popover";
import * as Dialog from "../components/core/dialog";
import { useController, useFieldArray, useFormContext } from "react-hook-form";
import Button, { ButtonContainer } from "../components/core/button";
import { Input, InputContainer, InputLabel } from "../components/core/input";
import { defaultWorkflow, UserConfig } from "../Config";
import { styled } from "../theme";
import WorkflowAction from "./workflow-action";
import { PlusIcon } from "@radix-ui/react-icons";
import { ComponentProps } from "@stitches/react";
import { useState } from "react";
import { ErrorMessage } from "@hookform/error-message";

type OnSubmitCurry = (
  callback?: () => void
) => (
  e?: React.BaseSyntheticEvent<object, any, any> | undefined
) => Promise<void>;

const WorkflowArray = ({ onSubmit }: { onSubmit: OnSubmitCurry }) => {
  const { fields } = useFieldArray<UserConfig, "workflows">({
    name: "workflows",
  });

  return (
    <div>
      <ButtonContainer>
        <AddWorkflowModal onSubmit={onSubmit} />
      </ButtonContainer>
      <StyledTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Arguments</th>
            <th>Steps</th>
            <th className="column-action">Actions</th>
          </tr>
        </thead>
        <tbody>
          {fields.map((item, index) => {
            return item ? (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.arguments}</td>
                <td>{item.steps.length}</td>
                <td className="column-action">
                  <EditWorkflowModal index={index} onSubmit={onSubmit} />
                </td>
              </tr>
            ) : (
              <></>
            );
          })}
        </tbody>
      </StyledTable>
    </div>
  );
};

const AddWorkflowModal = ({ onSubmit }: { onSubmit: OnSubmitCurry }) => {
  const { fields, append, remove } = useFieldArray<UserConfig, "workflows">({
    name: "workflows",
  });
  const removeTempItem = () => remove(fields.length - 1);
  const {
    formState: { isValid },
  } = useFormContext();
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay />
      <Dialog.Trigger asChild>
        <Button
          type="button"
          size="small"
          onClick={() => {
            append(defaultWorkflow);
          }}
        >
          <PlusIcon />
          Add Workflow
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Content
          onEscapeKeyDown={removeTempItem}
          onInteractOutside={removeTempItem}
        >
          <Dialog.Title>Add Workflow</Dialog.Title>
          <WorkflowForm index={fields.length - 1} />
          <Dialog.Footer>
            <ButtonContainer css={{ padding: 0 }}>
              <Dialog.Close asChild>
                <Button onClick={removeTempItem} appearance={"secondary"}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button
                onClick={() =>
                  onSubmit(() => {
                    setOpen(false);
                  })()
                }
                appearance="success"
                disabled={!isValid}
              >
                Save
              </Button>
            </ButtonContainer>
          </Dialog.Footer>
          <Dialog.CloseIconButton />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
const EditWorkflowModal = ({
  index,
  onSubmit,
}: {
  index: number;
  onSubmit: OnSubmitCurry;
}) => {
  const { remove } = useFieldArray<UserConfig, "workflows">({
    name: "workflows",
  });

  const {
    formState: { isSubmitting, isDirty },
  } = useFormContext();

  const disableButton = isSubmitting || !isDirty;

  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Overlay />
      <Dialog.Trigger asChild>
        <Button appearance="secondary" size="small">
          Edit
        </Button>
      </Dialog.Trigger>
      {/* <Dialog.Portal> */}
      <Dialog.Content>
        <Dialog.Title>Edit Workflow</Dialog.Title>
        <WorkflowForm index={index} />
        <Dialog.Footer>
          <ButtonContainer>
            <Dialog.Close asChild>
              <Button
                appearance="danger"
                type="button"
                onClick={() => {
                  remove(index);
                  onSubmit(() => setOpen(false))();
                }}
              >
                Delete Workflow
              </Button>
            </Dialog.Close>
            <Button
              appearance="success"
              disabled={disableButton}
              onClick={() => {
                onSubmit(() => setOpen(false));
              }}
            >
              Save
            </Button>
          </ButtonContainer>
        </Dialog.Footer>
        <Dialog.CloseIconButton />
      </Dialog.Content>
      {/* </Dialog.Portal> */}
    </Dialog.Root>
  );
};
const StyledTable = styled("table", {
  width: "100%",
  "th, td": {
    padding: "0.25rem",
  },
  th: {
    fontSize: "0.8rem",
    fontWeight: 600,
    textAlign: "start",
  },
  td: {
    fontSize: "1rem",
  },
  ".column-action > ": {
    textAlign: "end",
  },
});
const WorkflowForm = ({ index }: { index: number }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <InputContainer>
        <InputLabel>
          Name
          <Input
            {...register(`workflows.${index}.name`, { required: true })}
            autoComplete="none"
          />
        </InputLabel>
        <ErrorMessage errors={errors} name={`workflows.${index}.name`} />
      </InputContainer>
      <InputContainer>
        <div style={{ display: "flex" }}>
          <InputLabel htmlFor="arguments-input">
            Arguments (optional)
          </InputLabel>
          <Popover.Root>
            <Popover.InfoTrigger />
            <Popover.Portal>
              <Popover.Content>
                <Description>
                  Comma-separated list of argument names, to be used in paths
                  prefixed with $
                </Description>
                <Popover.Arrow />
              </Popover.Content>
            </Popover.Portal>
          </Popover.Root>
        </div>
        <StringArrayInput
          id="arguments-input"
          name={`workflows.${index}.arguments`}
        />
      </InputContainer>
      <WorkflowAction nestIndex={index} />
    </>
  );
};
const Description = styled("p", {
  margin: 0,
  marginBottom: "0.5rem",
  padding: 0,
  fontSize: "0.8rem",
});

const StringArrayInput = ({
  name,
  ...rest
}: { name: string } & ComponentProps<typeof Input>) => {
  const {
    field: { onChange, ...field },
  } = useController({
    name: name,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.split(",").map((e) => e.trim());
    onChange(value);
  };

  return <Input {...field} {...rest} onChange={handleChange} />;
};

export default WorkflowArray;
