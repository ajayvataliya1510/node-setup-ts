/**
 * ATM Controller
 * Handles the business logic for transactions
 */
class ATM {
  constructor(initialBalance = 0) {
    this.balance = initialBalance;
    this.transactionHistory = [];
  }

  // View current balance
  checkBalance() {
    return this.balance;
  }

  // Deposit funds
  deposit(amount) {
    if (amount <= 0) {
      throw new Error("Deposit amount must be positive.");
    }
    this.balance += amount;
    this._logTransaction("DEPOSIT", amount);
    return this.balance;
  }

  // Withdraw funds
  withdraw(amount) {
    if (amount <= 0) {
      throw new Error("Withdrawal amount must be positive.");
    }
    if (amount > this.balance) {
      throw new Error("Insufficient funds.");
    }
    
    this.balance -= amount;
    this._logTransaction("WITHDRAWAL", amount);
    return this.balance;
  }

  // Private helper to track history
  _logTransaction(type, amount) {
    this.transactionHistory.push({
      type,
      amount,
      date: new Date().toISOString(),
      remainingBalance: this.balance
    });
  }

  getHistory() {
    return this.transactionHistory;
  }
}

// --- Example Usage / Testing ---
try {
  const myATM = new ATM(1000); // Start with 1000 INR/USD

  console.log(`Initial Balance: ${myATM.checkBalance()}`);
  
  myATM.deposit(500);
  console.log(`After Deposit: ${myATM.checkBalance()}`);

  myATM.withdraw(200);
  console.log(`After Withdrawal: ${myATM.checkBalance()}`);

  // This will trigger the error handling
  // myATM.withdraw(5000); 

  console.table(myATM.getHistory());
} catch (error) {
  console.error(`Transaction Failed: ${error.message}`);
}
