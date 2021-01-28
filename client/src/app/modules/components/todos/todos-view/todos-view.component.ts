import { Component, OnInit } from '@angular/core';
import { Todo } from '@dynrec/common';
import { UserService } from '@services/user.service';
import { TodoService } from '../../../../services/todo.service';

@Component({
    selector: 'app-todos-view',
    templateUrl: './todos-view.component.html',
    styleUrls: ['./todos-view.component.scss'],
})
export class TodosViewComponent implements OnInit {
    blockedTodos: number[] = [];
    todos: Todo[] = [];
    filteredTodos: Todo[] = [];

    constructor(private readonly userService: UserService, private readonly todoService: TodoService) {}

    ngOnInit(): void {
        this.blockedTodos = JSON.parse(localStorage.getItem('BLOCKED_TODO_IDS') ?? '[]') ?? [];
        this.userService.getCurrentUser().subscribe({
            next: user => {
                if (!user) {
                    return;
                }

                this.loadTodos();
            },
        });
    }

    async loadTodos() {
        const result = await this.todoService.getTodos();
        this.todos = result.data;
        this.hideClosedTodos();
    }

    hideClosedTodos() {
        this.filteredTodos = this.todos.filter(todo => !this.blockedTodos.includes(todo.getHashId()));
    }

    handleCloseTodo(todo: Todo) {
        this.blockedTodos.push(todo.getHashId());
        localStorage.setItem('BLOCKED_TODO_IDS', JSON.stringify(this.blockedTodos));
        this.hideClosedTodos();
    }
}
