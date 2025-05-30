# API Hooks

This directory contains hooks for interacting with the API in a standardized way. All API hooks follow a consistent pattern using the BaseApiHooks factory.

## Standard Pattern

All entity API hooks in this application follow a standardized pattern using the `createBaseApiHooks` factory:

```typescript
// Example for any entity
const entityHooks = createBaseApiHooks<Entity, CreateDto, UpdateDto>({
  queryKeys: queryKeys.entity,
  services: {
    getAll: entityService.getEntities,
    getById: entityService.getEntityById,
    create: entityService.createEntity,
    update: entityService.updateEntity,
    delete: entityService.deleteEntity,
    getHistory: entityService.getEntityHistory, // Optional
  },
});

// Expose the standard CRUD hooks
export const useEntities = entityHooks.useAll;
export const useEntity = entityHooks.useOne;
export const useCreateEntity = entityHooks.useCreate;
export const useUpdateEntity = entityHooks.useUpdate;
export const useDeleteEntity = entityHooks.useDelete;
export const useEntityHistory = entityHooks.useHistory; // If history is supported
```

## Available Hooks

The standard hooks provided by the factory are:

| Hook         | Description                                 |
| ------------ | ------------------------------------------- |
| `useAll`     | Fetch all entities of a type                |
| `useOne`     | Fetch a single entity by ID                 |
| `useCreate`  | Create a new entity                         |
| `useUpdate`  | Update an existing entity                   |
| `useDelete`  | Delete an entity                            |
| `useHistory` | Fetch history for an entity (if applicable) |

## Custom Extensions

For specialized functionality beyond standard CRUD, you can extend the base hooks:

```typescript
export const useCustomEntityOperation = (
  options?: UseMutationOptions<Result, Error, Params>
) => {
  const queryClient = useQueryClient();

  return useMutation<Result, Error, Params>({
    mutationFn: (params) => entityService.customOperation(params),
    onSuccess: (data, variables, context) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: queryKeys.entity.all() });

      // Call the original onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    ...options,
  });
};
```

## Benefits

- **Consistency**: All API hooks follow the same pattern
- **Type Safety**: Full TypeScript support throughout
- **Query Invalidation**: Built-in query invalidation for CRUD operations
- **Extensibility**: Easy to extend for specialized operations
- **Reusability**: Common patterns abstracted into reusable hooks
- **Team Context Awareness**: Automatic handling of team context
- **Error Handling**: Consistent error handling across all API operations
