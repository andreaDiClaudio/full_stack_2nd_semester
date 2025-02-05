export class TodoEntity {
    public isCompleted: boolean = false;

    constructor(public id: number, public title: string) { }
}