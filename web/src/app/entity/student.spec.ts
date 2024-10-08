import { Student } from './student';

describe('User', () => {
  it('should create an instance', () => {
    expect(new Student()).toBeTruthy();
  });
});
