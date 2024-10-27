import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { of } from 'rxjs';
import { UsersComponent } from './users.component';
import { UsersService } from './../users.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSortModule, MatSort, Sort } from '@angular/material/sort';
import { ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EventEmitter } from '@angular/core';

// Mock classes for MatPaginator and MatSort
class MatPaginatorMock {
  pageSize = 5;
  pageIndex = 0;
  page = new EventEmitter<PageEvent>();
}

class MatSortMock {
  active = '';
  direction = '';
  sortChange = new EventEmitter<Sort>();
}

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', ['getUsers']);

    await TestBed.configureTestingModule({
      declarations: [UsersComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        MatCardModule,
        MatFormFieldModule,
        MatInputModule,
      ],
      providers: [
        { provide: UsersService, useValue: spy },
        { provide: MatPaginator, useClass: MatPaginatorMock },
        { provide: MatSort, useClass: MatSortMock },
      ],
    }).compileComponents();

    usersServiceSpy = TestBed.inject(
      UsersService
    ) as jasmine.SpyObj<UsersService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;


    component.ngOnInit();


    component.paginator = TestBed.inject(MatPaginator) as unknown as MatPaginator;
    component.sort = TestBed.inject(MatSort) as unknown as MatSort;

    usersServiceSpy.getUsers.and.returnValue(
      of({
        users: [
          {
            firstName: 'John',
            lastName: 'Doe',
            age: 30,
            address: '123 Main St',
          },
        ],
      })
    );
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });


  it('should call getUsers with updated paginator values', fakeAsync(() => {
    component.ngAfterViewInit();


    component.paginator.pageSize = 5;
    component.paginator.pageIndex = 1;


    component.paginator.page.emit({
      pageIndex: 1,
      pageSize: 5,
      length: 100,
    } as PageEvent);

    fixture.detectChanges();

    tick();

    expect(usersServiceSpy.getUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({
        limit: 5,
        skip: 1,
        sortBy: '',
        order: '',
      }),
      ''
    );
  }));

  it('should call getUsers with updated sort values', fakeAsync(() => {
    component.ngAfterViewInit();

    // Change sort values and emit a Sort event
    component.sort.active = 'firstName';
    component.sort.direction = 'asc';
    component.sort.sortChange.emit({
      active: 'firstName',
      direction: 'asc',
    } as Sort);

    tick(); // Advance observable processing
    fixture.detectChanges(); // Trigger change detection

    // Now check if getUsers is called with correct sort values
    expect(usersServiceSpy.getUsers).toHaveBeenCalledWith(
      jasmine.objectContaining({
        sortBy: 'firstName', // Ensure this is set
        order: 'asc', // Ensure this is set
      }),
      ''
    );
  }));
});
