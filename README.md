MonkeyJS
========
Define namespaces for implementation of simple components. This project is in its ideal create a **simple** javascript framework for building **applications**.

## Dependencies
* [jQuery](http://jquery.com/) ( >= 1.11.0) or (>= 2.1.0)

## Usage
```html
<div data-component="example" data-color="red">
    <span data-element="field">My Element</span>
    <button type="button" data-action="change-color">Set Color</button>
</div>
```

```js
Module.ComponentWrapper( 'Example', function(Example) {

    Example.fn.init = function() {
        this.addEventListener();
    };

    Example.fn.addEventListener = function() {
        this.addEvent( 'click', 'change-color' );
    };

    Example.fn.setBackground = function() {
        this.elements.field.css( 'background', this.color );
    };

    Example.fn._onClickChangeColor = function() {
        this.setBackground();
    };

});

//start components in application
Module.factory.create( $( 'body' ) );
```

### You also check the [wiki](https://github.com/kassyn/monkeyjs/wiki).

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D

## License
[MIT License](http://opensource.org/licenses/MIT)

## Thanks
[Nando Vieira](https://github.com/fnando) in project [module](https://github.com/fnando/module)
