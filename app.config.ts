export default defineAppConfig({
  ui: {
    input: {
      defaultVariants: {
        color: 'secondary',
      }
    },
    select: {
      defaultVariants: {
        color: 'secondary',
      }
    },
    table: {
      variants: {
        loading: {
          true: {
            thead: 'after:h-1'
          }
        },
      }
    },
  }
});
