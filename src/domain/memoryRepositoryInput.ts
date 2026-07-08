import type {
  MemoryRepositoryOperation,
  MemoryRepositorySaveInput,
} from "./memoryRepositoryContract";
import type {
  MemoryStorageRequest,
  MemoryStorageRequestResult,
  SkippedMemoryStorageRequest,
} from "./memoryStorageRequest";

export type MemoryRepositoryInputStatus = "prepared" | "skipped";

export type MemoryRepositoryInputSkippedReason =
  | "storage_request_skipped"
  | "unsupported_storage_request_operation";

export type MemoryRepositoryInputItem = {
  status: Extract<MemoryRepositoryInputStatus, "prepared">;
  input: MemoryRepositorySaveInput;
};

export type SkippedMemoryRepositoryInput = {
  status: Extract<MemoryRepositoryInputStatus, "skipped">;
  request: MemoryStorageRequest | SkippedMemoryStorageRequest;
  reason: MemoryRepositoryInputSkippedReason;
};

export type MemoryRepositoryInputResult = {
  inputs: MemoryRepositoryInputItem[];
  skipped: SkippedMemoryRepositoryInput[];
};

const REPOSITORY_OPERATION: MemoryRepositoryOperation = "save_memory_record";

function createRepositorySaveInput(request: MemoryStorageRequest): MemoryRepositorySaveInput {
  return {
    operation: REPOSITORY_OPERATION,
    request,
    requestOperation: request.operation,
    decisionReason: request.decisionReason,
    record: request.payload.record,
  };
}

function createSkippedInput(params: {
  request: MemoryStorageRequest | SkippedMemoryStorageRequest;
  reason: MemoryRepositoryInputSkippedReason;
}): SkippedMemoryRepositoryInput {
  return {
    status: "skipped",
    request: params.request,
    reason: params.reason,
  };
}

export function prepareMemoryRepositoryInputs(
  storageRequests: MemoryStorageRequestResult,
): MemoryRepositoryInputResult {
  const inputs: MemoryRepositoryInputItem[] = [];
  const skipped: SkippedMemoryRepositoryInput[] = storageRequests.skipped.map((request) =>
    createSkippedInput({ request, reason: "storage_request_skipped" }),
  );

  storageRequests.requests.forEach((request) => {
    if (request.operation !== "prepare_store_memory") {
      skipped.push(
        createSkippedInput({ request, reason: "unsupported_storage_request_operation" }),
      );
      return;
    }

    inputs.push({
      status: "prepared",
      input: createRepositorySaveInput(request),
    });
  });

  return { inputs, skipped };
}
