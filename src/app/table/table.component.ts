import { Component, OnInit } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Game } from '../models/game';
import { Sort } from '@angular/material/sort';
import { MatSortModule } from '@angular/material/sort';
export interface Item {
  id: string;
  gameName: string;
  price: number;
  imgLink: string;
  quantity: number;
  type: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
})
export class TableComponent implements OnInit {
  editForm = this.fb.group({
    GameName: ['', [Validators.required, Validators.minLength(5)]],
    Price: ['', [Validators.required, Validators.pattern('[0-9][0-9]*')]],
    ImageLink: ['', [Validators.required, Validators.minLength(10)]],
    quantity: ['', [Validators.required, Validators.pattern('[0-9][0-9]*')]],
    Type: ['', [Validators.required, Validators.maxLength(50)]],
  });
  updateForm = this.fb.group({
    GameName: ['', [Validators.required, Validators.minLength(5)]],
    Price: ['', [Validators.required, Validators.pattern('[0-9][0-9]*')]],
    ImageLink: ['', [Validators.required, Validators.minLength(10)]],
    quantity: ['', [Validators.required, Validators.pattern('[0-9][0-9]*')]],
    Type: ['', [Validators.required, Validators.maxLength(50)]],
  });
  private itemsCollection: AngularFirestoreCollection<Item>;
  searchText: any;
  items: Observable<Item[]>;
  items1: Item[] = [];
  config: any;
  game!: Game;
  id!: string;
  gameList: Game[] = [];
  sortedData = this.items1;
  constructor(private readonly afs: AngularFirestore, private fb: FormBuilder) {
    this.itemsCollection = afs.collection<Item>('Items');
    this.items = this.itemsCollection.valueChanges({ idField: 'key' });
    this.items.subscribe((data) => {
      this.items1 = data;

      this.config = {
        itemsPerPage: 4,
        currentPage: 1,
        totalItems: this.items1.length,
      };
      this.sortedData = this.items1.slice();
    });
  }
  ngOnInit(): void {}

  //
  pageChanged(event: number) {
    this.config.currentPage = event;
  }
  goToCreate() {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    document.getElementById('formCreate')!.style.display = 'block';
  }
  addNewGameToDB() {
    let gameName = this.editForm.controls.GameName.value;
    let id = gameName.replaceAll(' ', '').toLowerCase();
    let price = this.editForm.controls.Price.value;
    let imgLink = this.editForm.controls.ImageLink.value;
    let quantity = this.editForm.controls.quantity.value;
    let type = this.editForm.controls.Type.value;
    this.game = {
      id: id,
      gameName: gameName,
      price: Number(price),
      imgLink: imgLink,
      quantity: Number(quantity),
      type: type,
    };

    if (id && price && imgLink && quantity && type && gameName) {
      let check = this.itemsCollection?.ref.where('gameName', '==', gameName);
      check.get().then((game) => {
        if (game.size > 0) {
          alert('Sản phẩm tồn tại');
        } else {
          alert('Thêm thành công');
          const newGame = this.itemsCollection?.doc(this.game.id);
          console.log('Thêm thành công');
          newGame.set(Object.assign({}, this.game));
        }
      });
      let formReset = <HTMLFormElement>document.getElementById('editForm');
      formReset.reset();
      document.getElementById('formCreate')!.style.display = 'none';
    } else {
      alert('Vui lòng nhập đầy đủ thông tin');
    }
  }

  deleteGameFromFB(event: any) {
    console.log(event.target.id.toString());
    this.id = event.target.id.toString();
    this.itemsCollection.doc(this.id).delete();
    alert(`Xóa game thành công`);
  }
  updateGame(event: any) {
    document.getElementById('formUpdate')!.style.display = 'block';
    console.log(event.target.id);
    this.itemsCollection
      .doc(event.target.id)
      .valueChanges()
      .subscribe((item: any) => {
        console.log(item.gameName);
        this.updateForm.patchValue({
          GameName: item.gameName,
          Price: item.price,
          ImageLink: item.imgLink,
          quantity: item.quantity,
          Type: item.type,
        });
        let myStorage = window.localStorage;
        localStorage.setItem('docID', item.id);
      });
  }
  submitNewGame() {
    let gameName = this.updateForm.controls.GameName.value;
    let id = String(localStorage.getItem('docID'));
    let price = this.updateForm.controls.Price.value;
    let imgLink = this.updateForm.controls.ImageLink.value;
    let quantity = this.updateForm.controls.quantity.value;
    let type = this.updateForm.controls.Type.value;
    this.game = {
      id: id,
      gameName: gameName,
      price: Number(price),
      imgLink: imgLink,
      quantity: Number(quantity),
      type: type,
    };

    let check = this.itemsCollection?.ref.where('id', '==', id);
    check.get().then((game) => {
      if (game.size > 0) {
        alert('Update thành công');
        this.itemsCollection?.doc(this.game.id).update(this.game);
      } else {
        alert('Update thất bại');
      }
    });
    let formReset = <HTMLFormElement>document.getElementById('editForm');
    formReset.reset();
    document.getElementById('formUpdate')!.style.display = 'none';
  }
  sortData(sort: Sort) {
    const data = this.items1.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'price':
          return compare(a.price, b.price, isAsc);
        case 'quantity':
          return compare(a.quantity, b.quantity, isAsc);
        default:
          return 0;
      }
    });
  }
}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
