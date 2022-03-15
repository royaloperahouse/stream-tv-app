export class UnableToCheckRentalStatusError extends Error {
  constructor(message?: string) {
    super(
      message ||
        'Sorry, we have been unable to check the rental status. Please try again later',
    );
  }
}

export class NotRentedItemError extends Error {
  constructor(message?: string) {
    super(
      message ||
        'Sorry, you have not rented this item. Please go to the Royal Opera House website to rent this item',
    );
  }
}

export class NonSubscribedStatusError extends Error {
  constructor(message?: string) {
    super(message);
  }
}
