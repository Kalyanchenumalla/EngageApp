import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AccountService } from '../_services/account.service';
import { error } from 'console';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  @Input() usersFromHomeComponent: any;
  @Output() cancelRegister = new EventEmitter();

  constructor(private accountService: AccountService) {}
  ngOnInit(): void {
      
  }
  model: any = {};
  register() {
    this.accountService.register(this.model).subscribe({
      next: () => {
        // console.log(response);
        this.cancel();
      },
      error: error => console.log(error)
    })
  }

  cancel(){
    this.cancelRegister.emit(false);
  }
}
