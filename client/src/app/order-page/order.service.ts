import {Injectable} from "@angular/core";
import {OrderPosition, Position} from "../shared/interfaces";

@Injectable()
export class OrderService {
  public list: Array<OrderPosition> = [];
  public price = 0;

  add(position: Position): void {
    const orderPosition: OrderPosition = Object.assign({}, {
      name: position.name,
      cost: position.cost,
      quantity: position.quantity,
      _id: position._id
    });

    this.list.push(orderPosition);
  }

  remove(position: Position): void {

  }

  clear(): void {

  }
}
