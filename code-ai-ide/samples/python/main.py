#!/usr/bin/env python3
"""
Sample Python Project for Code AI IDE
A simple calculator application demonstrating various Python features.
"""

import math
from typing import Union, List, Dict
from dataclasses import dataclass
import json

@dataclass
class Calculation:
    """Represents a mathematical calculation."""
    operation: str
    operands: List[float]
    result: float
    timestamp: str

class Calculator:
    """A simple calculator class with basic operations."""
    
    def __init__(self):
        self.history: List[Calculation] = []
        self.operations = {
            '+': self.add,
            '-': self.subtract,
            '*': self.multiply,
            '/': self.divide,
            '**': self.power,
            'sqrt': self.sqrt,
            'log': self.log
        }
    
    def add(self, a: float, b: float) -> float:
        """Add two numbers."""
        return a + b
    
    def subtract(self, a: float, b: float) -> float:
        """Subtract b from a."""
        return a - b
    
    def multiply(self, a: float, b: float) -> float:
        """Multiply two numbers."""
        return a * b
    
    def divide(self, a: float, b: float) -> float:
        """Divide a by b."""
        if b == 0:
            raise ValueError("Cannot divide by zero")
        return a / b
    
    def power(self, a: float, b: float) -> float:
        """Raise a to the power of b."""
        return a ** b
    
    def sqrt(self, a: float) -> float:
        """Calculate square root of a."""
        if a < 0:
            raise ValueError("Cannot calculate square root of negative number")
        return math.sqrt(a)
    
    def log(self, a: float, base: float = 10) -> float:
        """Calculate logarithm of a with given base."""
        if a <= 0 or base <= 0:
            raise ValueError("Invalid arguments for logarithm")
        return math.log(a, base)
    
    def calculate(self, operation: str, *operands: float) -> float:
        """Perform a calculation and store in history."""
        if operation not in self.operations:
            raise ValueError(f"Unknown operation: {operation}")
        
        if operation in ['sqrt', 'log']:
            if len(operands) == 1:
                result = self.operations[operation](operands[0])
            elif len(operands) == 2 and operation == 'log':
                result = self.operations[operation](operands[0], operands[1])
            else:
                raise ValueError(f"Operation {operation} requires 1-2 operands")
        else:
            if len(operands) < 2:
                raise ValueError(f"Operation {operation} requires at least 2 operands")
            result = self.operations[operation](operands[0], operands[1])
        
        # Store calculation in history
        calc = Calculation(
            operation=operation,
            operands=list(operands),
            result=result,
            timestamp=json.dumps({"time": "now"})  # Simplified timestamp
        )
        self.history.append(calc)
        
        return result
    
    def get_history(self) -> List[Calculation]:
        """Get calculation history."""
        return self.history
    
    def clear_history(self):
        """Clear calculation history."""
        self.history.clear()

def main():
    """Main function demonstrating the calculator."""
    print("Welcome to Code AI IDE Python Calculator!")
    print("=" * 40)
    
    calc = Calculator()
    
    # Example calculations
    try:
        print(f"2 + 3 = {calc.calculate('+', 2, 3)}")
        print(f"10 - 4 = {calc.calculate('-', 10, 4)}")
        print(f"5 * 6 = {calc.calculate('*', 5, 6)}")
        print(f"15 / 3 = {calc.calculate('/', 15, 3)}")
        print(f"2 ** 8 = {calc.calculate('**', 2, 8)}")
        print(f"sqrt(16) = {calc.calculate('sqrt', 16)}")
        print(f"log(100) = {calc.calculate('log', 100)}")
        
        print("\nCalculation History:")
        for i, calc_record in enumerate(calc.get_history(), 1):
            print(f"{i}. {calc_record.operation}({calc_record.operands}) = {calc_record.result}")
            
    except ValueError as e:
        print(f"Error: {e}")
    except Exception as e:
        print(f"Unexpected error: {e}")

if __name__ == "__main__":
    main()
