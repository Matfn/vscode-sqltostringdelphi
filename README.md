# SQL To String Delphi

Convert SQL query to simple String in Delphi.

## Commands

* **STSD: Delphi to SQL** Converts the string used for query in Delphi to a query to be used in MS SQL.
* **STSD: SQL To Delphi** : Add quotes at the beginning and end of each line of the selected query, concatenating the text to be used as a string in Delphi.

## Extension Settings

* `sqltostringdelphi.InitialVariable`: the entered text will be concatenated to the String at the beginning of each line.
* `sqltostringdelphi.FinalVariable`: the entered text will be concatenated to String at the end of each line.
* `sqltostringdelphi.ConsiderTheLargestLine`: considers the line that has the largest amount of text to inform the end of the String.
* `sqltostringdelphi.InitialVariableFirstLine`: does not display the text of the "Initial Variable" field in the first line.
* `sqltostringdelphi.FinalVariableLastLine`: does not display the text of the "Final Variable" field in the last line.
* `sqltostringdelphi.LocalVariables`: Identify parameters in the string to be used as local variables.