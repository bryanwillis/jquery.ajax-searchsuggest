jquery.ajax-searchsuggest
=========================

jQuery plugin using Google Suggest API to show auto suggests under the search filed.

## Installation

Include the script after the jQuery library:

```html
<script src="/path/to/jquery.ajax-searchsuggest.js"></script>
```

## Usage

```javascript
$(selector).ajaxSearchSuggest();
```

EXAMPLE

```html
<!-- HTML -->
<input type="text" name="s">
<input type="search" name="s">
<input type="url" name="s">
```

```javascript
// JavaScirpt 
$('[name=s]').ajaxSearchSuggest();
```

## Authors

[Shunsuke Kusakabe](https://github.com/shunk76)

##License

jQuery.ajax-searchsuggest is released under the [MIT License](http://opensource.org/licenses/MIT).
