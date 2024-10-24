import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	const config = vscode.workspace.getConfiguration('sqltostringdelphi');
	const initialVar: string = config.get<string>('InitialVariable')!;
	const finalVar: string = config.get<string>('FinalVariable')!;
	const largestLine: boolean = config.get<boolean>('ConsiderTheLargestLine')!;
	const initialVarFirstLine: boolean = config.get<boolean>('InitialVariableFirstLine')!;
	const finalVarLastLine: boolean = config.get<boolean>('FinalVariableLastLine')!;
	const localVariables: boolean = config.get<boolean>('LocalVariables')!;

	let DelphiToSQL = vscode.commands.registerCommand('sqltostringdelphi.DelphiToSQL', () => {
        const editor = vscode.window.activeTextEditor;
		
        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

			if (selectedText.length > 0) {
				const lines = selectedText.split('\r\n');
				const arrayVariables: string[] = [];
				const linesReplace: string[] = [];
				const param = /(@\w+)/g;

				lines.forEach(line => {
					if (line.length > 0) {
						let lineAux = line.replaceAll(/''/g, "'");
						lineAux = lineAux.replaceAll(':', '@');

						let startPos = lineAux.indexOf("'");
						let match;

						if (localVariables) {
							while ((match = param.exec(lineAux)) !== null) {
								let varDeclare = match[0];

								if (!arrayVariables.includes(varDeclare)) {
									arrayVariables.push(varDeclare);
								}
							}
						}

						if (startPos != -1){
							let finalPos = startPos;
							startPos = finalPos + 1;

							while ((lineAux.indexOf("'", finalPos + 1)) > finalPos) {
								finalPos = lineAux.indexOf("'", finalPos + 1);
							}

							linesReplace.push(lineAux.slice(startPos, finalPos).trimEnd());
						}
					}
				});

				if (linesReplace.length > 0) {
					editor.edit(editBuilder => {
						if (arrayVariables.length > 0) {
							for (var i = 0; i < arrayVariables.length; i++) {
								if (i > 0) {
									arrayVariables[i] = ', ' + arrayVariables[i];
								}
							}

							arrayVariables.splice(0, 0, '/*');
							arrayVariables.splice(1, 0, 'DECLARE');
							arrayVariables.splice(arrayVariables.length, 0, '*/');

							linesReplace.splice(0, 0, arrayVariables.join('\n').toString());
						}
						
						editBuilder.replace(selection, linesReplace.join('\n'));
					});
				}
			}
        }
    });

	let SQLToDelphi = vscode.commands.registerCommand('sqltostringdelphi.SQLToDelphi', () => {
        const editor = vscode.window.activeTextEditor;

        if (editor) {
            const selection = editor.selection;
            const selectedText = editor.document.getText(selection);

			if (selectedText.length > 0) {
				const lines = selectedText.split('\r\n');
				const linesReplace: string[] = [];
				let maxSize = 0;
				let lineAux = "";
				

				if (largestLine){
					lines.map(line => {
						if (line.length > 0) {
							lineAux = line.replaceAll(/'/g, "''").trimEnd();	
							
							if (lineAux.length > maxSize){
								maxSize = lineAux.length;
							}
						}
					});
				}

				for(let i = 0; i < lines.length; i++){
					let line = lines[i];

					if (line.length > 0) {
						lineAux = line.replaceAll(/'/g, "''");
						lineAux = lineAux.replaceAll('@', ':');
						let startLine = "";
						let endLine = "";

						if (maxSize > 0){
							let tamLinha = (maxSize - lineAux.length);

							for(let j = 1; j <= tamLinha; j++) {
								lineAux = lineAux + ' ';
							}
						}

						if ((linesReplace.length == 0) && (!initialVarFirstLine)){
							startLine = "'";
						} else {
							startLine = initialVar.length > 0 ? initialVar + " + '" : "'";
						}

						if (i < lines.length - 1){
							endLine = finalVar.length > 0 ? " ' + " + finalVar + ' +' : " ' +";
						} else {
							if (finalVarLastLine){
								endLine = finalVar.length > 0 ? " ' + " + finalVar + ' ;' : " ' ;";
							} else {
								endLine = " ' ;";
							}
						}

						linesReplace.push(startLine + lineAux + endLine);
					}
				};

				editor.edit(editBuilder => {
					editBuilder.replace(selection, linesReplace.join('\n'));
				});
			}
        }
    });
	context.subscriptions.push(DelphiToSQL);
    context.subscriptions.push(SQLToDelphi);
}