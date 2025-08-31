/**
 * Task Management System
 * Demonstrates TypeScript interfaces, enums, and class features.
 */

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review',
  DONE = 'done',
  CANCELLED = 'cancelled'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  tags: string[];
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  priority?: TaskPriority;
  dueDate?: Date;
  tags?: string[];
  assignee?: string;
  estimatedHours?: number;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate?: Date;
  tags?: string[];
  assignee?: string;
  estimatedHours?: number;
  actualHours?: number;
}

export class TaskManager {
  private tasks: Map<string, Task> = new Map();
  private nextId = 1;

  /**
   * Create a new task
   */
  createTask(request: CreateTaskRequest): Task {
    const now = new Date();
    const task: Task = {
      id: `task-${this.nextId++}`,
      title: request.title,
      description: request.description || '',
      priority: request.priority || TaskPriority.MEDIUM,
      status: TaskStatus.TODO,
      createdAt: now,
      updatedAt: now,
      dueDate: request.dueDate,
      tags: request.tags || [],
      assignee: request.assignee,
      estimatedHours: request.estimatedHours,
      actualHours: 0
    };

    this.tasks.set(task.id, task);
    return task;
  }

  /**
   * Get a task by ID
   */
  getTask(id: string): Task | undefined {
    return this.tasks.get(id);
  }

  /**
   * Get all tasks
   */
  getAllTasks(): Task[] {
    return Array.from(this.tasks.values());
  }

  /**
   * Update a task
   */
  updateTask(id: string, updates: UpdateTaskRequest): Task | undefined {
    const task = this.tasks.get(id);
    if (!task) {
      return undefined;
    }

    const updatedTask: Task = {
      ...task,
      ...updates,
      updatedAt: new Date()
    };

    this.tasks.set(id, updatedTask);
    return updatedTask;
  }

  /**
   * Delete a task
   */
  deleteTask(id: string): boolean {
    return this.tasks.delete(id);
  }

  /**
   * Get tasks by priority
   */
  getTasksByPriority(priority: TaskPriority): Task[] {
    return this.getAllTasks().filter(task => task.priority === priority);
  }

  /**
   * Get tasks by status
   */
  getTasksByStatus(status: TaskStatus): Task[] {
    return this.getAllTasks().filter(task => task.status === status);
  }

  /**
   * Get overdue tasks
   */
  getOverdueTasks(): Task[] {
    const now = new Date();
    return this.getAllTasks().filter(task => 
      task.dueDate && task.dueDate < now && task.status !== TaskStatus.DONE
    );
  }

  /**
   * Get tasks due today
   */
  getTasksDueToday(): Task[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return this.getAllTasks().filter(task => 
      task.dueDate && 
      task.dueDate >= today && 
      task.dueDate < tomorrow
    );
  }

  /**
   * Search tasks by text
   */
  searchTasks(query: string): Task[] {
    const lowerQuery = query.toLowerCase();
    return this.getAllTasks().filter(task =>
      task.title.toLowerCase().includes(lowerQuery) ||
      task.description.toLowerCase().includes(lowerQuery) ||
      task.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get tasks by assignee
   */
  getTasksByAssignee(assignee: string): Task[] {
    return this.getAllTasks().filter(task => task.assignee === assignee);
  }

  /**
   * Get task statistics
   */
  getTaskStatistics() {
    const allTasks = this.getAllTasks();
    const total = allTasks.length;
    const completed = allTasks.filter(task => task.status === TaskStatus.DONE).length;
    const inProgress = allTasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
    const overdue = this.getOverdueTasks().length;

    return {
      total,
      completed,
      inProgress,
      overdue,
      completionRate: total > 0 ? (completed / total) * 100 : 0
    };
  }

  /**
   * Bulk update task status
   */
  bulkUpdateStatus(taskIds: string[], status: TaskStatus): number {
    let updatedCount = 0;
    
    for (const id of taskIds) {
      if (this.updateTask(id, { status })) {
        updatedCount++;
      }
    }

    return updatedCount;
  }

  /**
   * Clear all tasks
   */
  clearAllTasks(): void {
    this.tasks.clear();
    this.nextId = 1;
  }
}
