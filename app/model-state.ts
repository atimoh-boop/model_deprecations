export type Model = {
  id: string;
  label: string;
  status: "active" | "deprecated";
  contextWindow: string;
};

export type ProjectModelState = {
  selected: Model;
  active: Model;
  fallback: null | {
    reason: "selected_model_deprecated";
    sourceModelId: string;
  };
  updatedAt: string;
};

export type Project = {
  id: string;
  name: string;
  model: ProjectModelState;
};

const atlas: Model = {
  id: "atlas-2",
  label: "Atlas 2",
  status: "deprecated",
  contextWindow: "128k tokens",
};

const nimbus: Model = {
  id: "nimbus-4-1",
  label: "Nimbus 4.1",
  status: "active",
  contextWindow: "256k tokens",
};

export function isDeprecatedModelFallback(model: ProjectModelState) {
  return (
    model.fallback?.reason === "selected_model_deprecated" &&
    model.fallback.sourceModelId === model.selected.id &&
    model.selected.status === "deprecated" &&
    model.active.id !== model.selected.id
  );
}

export function getProjectModelState(state: "fallback" | "active"): Project {
  return {
    id: "prj_8KL42P",
    name: "FAQ Assistant",
    model:
      state === "fallback"
        ? {
            selected: atlas,
            active: nimbus,
            fallback: {
              reason: "selected_model_deprecated",
              sourceModelId: atlas.id,
            },
            updatedAt: "Today",
          }
        : {
            selected: nimbus,
            active: nimbus,
            fallback: null,
            updatedAt: "Jun 28, 2026",
          },
  };
}
