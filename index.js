#!/usr/bin/env node

import Scenarist from '@faddys/scenarist';
import command from '@faddys/command';
import Page from './page.js';
import { parse } from 'node:path';

const $$ = Symbol .for;

try {

await Scenarist ( new class Roll {

usage = 'Usage: roll <filename> [ ... environmentVariableName environmentVariableValue ]';

constructor () {

const roll = this;
const argv = process .argv .slice ( 2 );

if ( ! argv .length )
throw ReferenceError ( [

'The <filename> is missing',
roll .usage

] .join ( '. ' ) );

roll .filename = argv .shift ();
roll .argv = argv;

}

async $_producer ( $ ) {

const roll = this;
const script = await command ( 'cat', roll .filename )
.then ( async $ => ( {

output: await $ ( $$ ( 'output' ) ),
error: await $ ( $$ ( 'error' ) )

} ) );

if ( script .error .length )
throw Error ( script .error .join ( '\n' ) );

roll .script = script .output;

await $ ( $$ ( 'processor' ) );

}

index = 0

async $_processor ( $ ) {

const roll = this;

if ( ! roll .script .length )
return await $ ( $$ ( 'run' ) );

roll .index++;
roll .line = roll .script .shift ();

await $ ( ... roll .line .trim () .split ( /\s+/ ) );

await $ ( $$ ( 'processor' ) );

}

[ '$?#' ] = Page;

[ '$?+' ] ( $, variable, value ) {

if ( variable === undefined )
throw ReferenceError ( 'Environment variable cannot be undefined' );

if ( value === undefined )
throw ReferenceError ( 'Value for environment variable cannot be undefined' );

process .env [ variable ] = value;

}

[ '$?-' ] ( $, variable, value ) {

if ( variable === undefined )
throw ReferenceError ( 'Environment variable cannot be undefined' );

delete process .env [ variable ];

}

} );

} catch ( issue ) {

console .error ( issue );
//console .error ( issue .name + ':', issue .message );

const { dir } = parse ( new URL ( import .meta .url ) .pathname );
const json = await command ( `cat ${ dir }/package.json` )
.then ( async $ => await $ ( $$ ( 'output' ) ) );
const metadata = JSON .parse ( json .join ( '\n' ) );

console .error ( `
${ metadata .name } v${ metadata .version }` );

}
