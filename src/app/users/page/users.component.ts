import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from './../users.service';
import { debounceTime, merge, Observable, startWith, switchMap } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss',
})
export class UsersComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = [
    'firstName',
    'lastName',
    'age',
    'address',
  ];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public searchControl!: FormControl;
  public searchResults$!: Observable<any>;

  constructor(
    private usersSerice: UsersService,
    private formBuilder: FormBuilder
  ) {}

  public ngOnInit(): void {
    this.searchControl = this.formBuilder.control('');
  }

  public ngAfterViewInit(): void {
    this.searchResults$ = merge(
      this.searchControl.valueChanges.pipe(debounceTime(500)),
      this.sort.sortChange,
      this.paginator.page
    ).pipe(
      startWith({
        select: 'firstName,lastName,age,address',
        limit: 5,
        skip: 0,
      }),
      switchMap((data) => {
        const keyword = this.searchControl.value ?? '';

        const dataForQuery = {
          ...data,
          sortBy: this.sort.active,
          order: this.sort.direction,
          skip: this.paginator.pageIndex,
          limit: this.paginator.pageSize,
        };
        return this.usersSerice.getUsers(dataForQuery, keyword);
      })
    );
  }
}
