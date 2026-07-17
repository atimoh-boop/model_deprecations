export type Model = { id: string; label: string; status: "active" | "deprecated"; contextWindow: string };
export type ProjectModelState = { selected: Model; active: Model; fallback: null | { reason: "selected_model_deprecated"; sourceModelId: string }; updatedAt: string };
export type Project = { id: string; name: string; model: ProjectModelState };

const previousModel: Model = { id: "gpt-4-1-mini", label: "GPT-4.1 Mini", status: "deprecated", contextWindow: "1M tokens" };
const fallbackModel: Model = { id: "gpt-5-4-nano", label: "GPT-5.4 Nano", status: "active", contextWindow: "128k tokens" };

export function isDeprecatedModelFallback(model: ProjectModelState) {
  return model.fallback?.reason === "selected_model_deprecated" && model.fallback.sourceModelId === model.selected.id && model.selected.status === "deprecated" && model.active.id !== model.selected.id;
}

export function getProjectModelState(state: "fallback" | "active"): Project {
  return { id: "1784051755110", name: "FAQ Assistant", model: state === "fallback"
    ? { selected: previousModel, active: fallbackModel, fallback: { reason: "selected_model_deprecated", sourceModelId: previousModel.id }, updatedAt: "Today" }
    : { selected: fallbackModel, active: fallbackModel, fallback: null, updatedAt: "Today" } };
}
