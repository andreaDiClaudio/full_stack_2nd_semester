export class TodoEntity {
    public completed: boolean = false;

    constructor(public id: number, public title: string) { }
}