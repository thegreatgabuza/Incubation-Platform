# Todo Component

A flexible and customizable todo/checklist component built with React and Ant Design for the Incubation Platform.

## Features

- Simple todo list with checkboxes
- Category-based organization of todo items
- Progress tracking for overall completion and per category
- Support for item prioritization
- Due date assignment
- Notes for additional context
- Fully customizable appearance and behavior

## Usage

### Basic Usage

Import the component and use it with a list of todo items:

```tsx
import { Todo, TodoItem } from '../components/Todo';

const MyComponent = () => {
  const [items, setItems] = useState<TodoItem[]>([
    { id: '1', text: 'Create project plan', isCompleted: true },
    { id: '2', text: 'Design component architecture', isCompleted: false },
    { id: '3', text: 'Implement core functionality', isCompleted: false },
  ]);

  return (
    <Todo
      title="Project Tasks"
      description="Track your project tasks and progress"
      items={items}
      onChange={setItems}
    />
  );
};
```

### Categorized Todo List

Group items by categories:

```tsx
<Todo
  title="Due Diligence Checklist"
  description="Comprehensive checklist for investment due diligence"
  items={categorizedItems}
  categories={['Financial', 'Legal', 'Market', 'Team']}
  showCategories={true}
  onChange={setCategorizedItems}
/>
```

### Advanced Usage with Priority and Due Dates

Add priority levels and due dates to todo items:

```tsx
const items = [
  { 
    id: '1', 
    text: 'Prepare quarterly report', 
    isCompleted: false, 
    priority: 'High',
    dueDate: '2023-12-31',
    notes: 'Include financial projections and growth metrics'
  },
  // ... more items
];

<Todo
  title="Task Management"
  description="Manage tasks with priorities and due dates"
  items={items}
  onChange={setItems}
/>
```

### Fully Customizable

Control all aspects of the component's behavior:

```tsx
<Todo
  title="Configurable Todo List"
  description="Adjust options to see how the component behaves"
  items={items}
  categories={categories}
  showCategories={true}
  showProgress={true}
  allowAddItem={true}
  allowDeleteItem={true}
  allowEditItem={true}
  allowAddNotes={true}
  onChange={setItems}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| title | string | 'Todo List' | The title displayed at the top of the component |
| description | string | undefined | Optional description text |
| items | TodoItem[] | [] | Array of todo items |
| categories | string[] | [] | Array of category names (required if showCategories is true) |
| showCategories | boolean | false | Whether to display items grouped by category |
| showProgress | boolean | true | Whether to display progress bars |
| allowAddItem | boolean | true | Whether to allow adding new items |
| allowDeleteItem | boolean | true | Whether to allow deleting items |
| allowEditItem | boolean | true | Whether to allow editing items |
| allowAddNotes | boolean | true | Whether to allow adding notes to items |
| onChange | function | undefined | Callback function called when items change |

## TodoItem Interface

```tsx
interface TodoItem {
  id: string;
  text: string;
  isCompleted: boolean;
  category?: string;
  notes?: string;
  dueDate?: string;
  priority?: 'High' | 'Medium' | 'Low';
}
```

## Example Component

An example component (`TodoExample.tsx`) is provided to demonstrate the various ways to use the Todo component. It includes:

1. Basic Todo List
2. Categorized Todo List
3. Advanced Features (priority, due dates, notes)
4. Customizable Configuration

## Integration with Existing Functionality

The Todo component has been designed to integrate seamlessly with the existing project structure and can be used in various parts of the application:

- Operations Dashboard for task tracking
- Due Diligence process in the Funder module
- Compliance checklists
- Project management workflows

## Styling

The component uses Ant Design for styling and can be easily integrated into any part of the application that already uses Ant Design. 