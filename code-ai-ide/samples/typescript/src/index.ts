/**
 * Sample TypeScript Project for Code AI IDE
 * A simple task management application demonstrating TypeScript features.
 */

import express from 'express';
import { TaskManager, Task, TaskPriority, TaskStatus } from './taskManager';
import { Logger } from './utils/logger';

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Initialize services
const taskManager = new TaskManager();
const logger = new Logger();

// Routes
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.get('/tasks', (req, res) => {
  try {
    const tasks = taskManager.getAllTasks();
    res.json({ success: true, data: tasks });
  } catch (error) {
    logger.error('Failed to fetch tasks', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.post('/tasks', (req, res) => {
  try {
    const { title, description, priority, dueDate } = req.body;
    
    if (!title) {
      return res.status(400).json({ success: false, error: 'Title is required' });
    }

    const task = taskManager.createTask({
      title,
      description: description || '',
      priority: priority || TaskPriority.MEDIUM,
      dueDate: dueDate ? new Date(dueDate) : undefined
    });

    logger.info(`Task created: ${task.id}`);
    res.status(201).json({ success: true, data: task });
  } catch (error) {
    logger.error('Failed to create task', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.put('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const task = taskManager.updateTask(id, updates);
    if (!task) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    logger.info(`Task updated: ${id}`);
    res.json({ success: true, data: task });
  } catch (error) {
    logger.error('Failed to update task', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.delete('/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const deleted = taskManager.deleteTask(id);
    
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Task not found' });
    }

    logger.info(`Task deleted: ${id}`);
    res.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    logger.error('Failed to delete task', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Start server
app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Health check: http://localhost:${port}/health`);
  logger.info(`API docs: http://localhost:${port}/tasks`);
});

// Example usage
async function demonstrateFeatures() {
  logger.info('Demonstrating TypeScript features...');

  // Create some sample tasks
  const task1 = taskManager.createTask({
    title: 'Learn TypeScript',
    description: 'Master TypeScript fundamentals and advanced features',
    priority: TaskPriority.HIGH,
    dueDate: new Date('2024-12-31')
  });

  const task2 = taskManager.createTask({
    title: 'Build API',
    description: 'Create RESTful API with Express and TypeScript',
    priority: TaskPriority.MEDIUM
  });

  const task3 = taskManager.createTask({
    title: 'Write Tests',
    description: 'Add comprehensive test coverage',
    priority: TaskPriority.LOW,
    dueDate: new Date('2024-11-30')
  });

  // Update a task
  taskManager.updateTask(task2.id, { status: TaskStatus.IN_PROGRESS });

  // Display all tasks
  const allTasks = taskManager.getAllTasks();
  logger.info(`Total tasks: ${allTasks.length}`);
  
  allTasks.forEach(task => {
    logger.info(`- ${task.title} (${task.status}) - Priority: ${task.priority}`);
  });

  // Demonstrate filtering
  const highPriorityTasks = taskManager.getTasksByPriority(TaskPriority.HIGH);
  logger.info(`High priority tasks: ${highPriorityTasks.length}`);

  const overdueTasks = taskManager.getOverdueTasks();
  logger.info(`Overdue tasks: ${overdueTasks.length}`);
}

// Run demonstration if this file is executed directly
if (require.main === module) {
  demonstrateFeatures().catch(error => {
    logger.error('Demonstration failed', error);
    process.exit(1);
  });
}

export { app, taskManager, logger };
