import { CommandContext } from "../../components/CommandList";

export const insertComponent = (component: string) => (ctx: CommandContext) => {
  return ctx.editor
    .chain()
    .focus()
    .deleteRange(ctx.range)
    .insertContent(component)
    .run();
};
