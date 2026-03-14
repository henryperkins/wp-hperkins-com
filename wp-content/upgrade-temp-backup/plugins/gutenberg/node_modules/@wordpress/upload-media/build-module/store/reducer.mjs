// packages/upload-media/src/store/reducer.ts
import {
  ItemStatus,
  Type
} from "./types.mjs";
import {
  DEFAULT_MAX_CONCURRENT_UPLOADS,
  DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING
} from "./constants.mjs";
var noop = () => {
};
var DEFAULT_STATE = {
  queue: [],
  queueStatus: "active",
  blobUrls: {},
  settings: {
    mediaUpload: noop,
    maxConcurrentUploads: DEFAULT_MAX_CONCURRENT_UPLOADS,
    maxConcurrentImageProcessing: DEFAULT_MAX_CONCURRENT_IMAGE_PROCESSING
  }
};
function reducer(state = DEFAULT_STATE, action = { type: Type.Unknown }) {
  switch (action.type) {
    case Type.PauseQueue: {
      return {
        ...state,
        queueStatus: "paused"
      };
    }
    case Type.ResumeQueue: {
      return {
        ...state,
        queueStatus: "active"
      };
    }
    case Type.PauseItem:
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            status: ItemStatus.Paused
          } : item
        )
      };
    case Type.ResumeItem:
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            status: ItemStatus.Processing
          } : item
        )
      };
    case Type.Add:
      return {
        ...state,
        queue: [...state.queue, action.item]
      };
    case Type.Cancel:
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            error: action.error
          } : item
        )
      };
    case Type.RetryItem:
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            status: ItemStatus.Processing,
            error: void 0,
            retryCount: (item.retryCount ?? 0) + 1
          } : item
        )
      };
    case Type.Remove:
      return {
        ...state,
        queue: state.queue.filter((item) => item.id !== action.id)
      };
    case Type.OperationStart: {
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            currentOperation: action.operation
          } : item
        )
      };
    }
    case Type.AddOperations:
      return {
        ...state,
        queue: state.queue.map((item) => {
          if (item.id !== action.id) {
            return item;
          }
          return {
            ...item,
            operations: [
              ...item.operations || [],
              ...action.operations
            ]
          };
        })
      };
    case Type.OperationFinish:
      return {
        ...state,
        queue: state.queue.map((item) => {
          if (item.id !== action.id) {
            return item;
          }
          const operations = item.operations ? item.operations.slice(1) : [];
          const attachment = item.attachment || action.item.attachment ? {
            ...item.attachment,
            ...action.item.attachment
          } : void 0;
          return {
            ...item,
            currentOperation: void 0,
            operations,
            ...action.item,
            attachment,
            additionalData: {
              ...item.additionalData,
              ...action.item.additionalData
            }
          };
        })
      };
    case Type.CacheBlobUrl: {
      const blobUrls = state.blobUrls[action.id] || [];
      return {
        ...state,
        blobUrls: {
          ...state.blobUrls,
          [action.id]: [...blobUrls, action.blobUrl]
        }
      };
    }
    case Type.RevokeBlobUrls: {
      const newBlobUrls = { ...state.blobUrls };
      delete newBlobUrls[action.id];
      return {
        ...state,
        blobUrls: newBlobUrls
      };
    }
    case Type.UpdateProgress:
      return {
        ...state,
        queue: state.queue.map(
          (item) => item.id === action.id ? {
            ...item,
            progress: action.progress
          } : item
        )
      };
    case Type.UpdateSettings: {
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.settings
        }
      };
    }
  }
  return state;
}
var reducer_default = reducer;
export {
  reducer_default as default
};
//# sourceMappingURL=reducer.mjs.map
