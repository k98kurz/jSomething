Title: jSomething Lightweight JavaScript Framework
Date: 12/14/2010
UpDate: 1/3/2013
Version 1.1.0
Author: Jonathan Voss

  **** NEW as of 1.1.0 ****
  1) Added no-conflict mode to run alongside jQuery, if necessary.
     If $ is in use, defaults to j$.
  2) Added lastReturnObject to support returned objects more directly.
  3) String.prototype.stripEndWS is now String.prototype.strip and is
     now identical to the strip method in my css.js library.
  4) $.hasUnique is now Object.prototype.hasUnique and Array.prototype.hasUnique

[ == Contents == ]
1. Description
2. Usage
  a) Specific object API
  b) Extensions
  c) Plugin authoring
    i) Installation
    ii) Persistence Cache
    iii) Plugin Construction
3. Final note


[ == 1. Description == ]
  This code is designed to be used as a lightweight framework from which to develop
customized libraries. The framework itself is quite simple, with a down-to-earth
object returned from the constructor. The framework file itself is only 388 lines.
  The ideas of recursion and the function being a "return new" constructor were
borrowed from jQuery. The idea to name it jSomething was also inspired by jQuery.
The main ideas behind the framework are simplicity, high customization, and
decentralized development.


[ == 2. Usage == ]
  Usage is quite simple. You pass the function either an element ID, an element, an
object with instructions for constructing a new element, or an html string. The
function returns an object encasing the element. In the case of html string input,
the element is a div. In no-conflict mode, use j$ instead of $.

  a) Specific object API
    $(string ElementID)
      Retrieves the element with the input ID.

    $(element Element)
      Wraps element in jSomething object.

    $(object NewElement)
      Use an object of the following format to create an element:
      { tag:'p', attributes:{}, events:[{}], css:{}, html:'Lorem<br />ipsum' }
      All properties in attributes object will be assigned to the element.
      All properties in css object will be assigned to the element style object.
      See also ::addEvent

    $(string NewHTML)
      Creates a div element and takes the input HTML as the innerHTML of the div.
      Note that the string must be valid HTML or the returned object will be null.

    ::returnValue(mixed value)
      Queues return value to be returned by lastReturnArray, etc. Used only for
      plugin development. Breaks recursivity. Seriously, don't use it outside
      of a plugin. It's bad taste.

    ::lastReturnArray()
      Returns the last array returned by method call. Breaks recursivity. Useful for
      use in a plugin.

    ::lastReturnBool()
      Returns the last bool returned by method call. Breaks recursivity. Userful for
      use in a plugin.

    ::lastReturnNumber()
      Returns the last number returned by method call. Breaks recursivity. Userful for
      use in a plugin.

    ::lastReturnValue()
      Returns the last value returned by method call. Breaks recursivity. Userful for
      use in a plugin. By default, every value is copied here as well as the
      specific data type return value.

    ::addEvent(array EventObjects)
      Adds events to the object. The event objects must be of the following format:
      { type:"click", func:function(){alert("Example");}, useC:false }
      Note: useC is the useCapture bool and may be omitted. Be sure to pass an array
      to the addEvent method.

    ::removeEvent(array EventObjects)
      Removes events from the object. The event objects must follow the same format
      as for the addEvent method

    ::resetEvents(string EventType)
      Removes all events of EventType that have been previously added to the element
      within the object instance. A rewrite of the event system to keep track of
      events outside of particular instances would best be done in an overwriting
      plugin package.

    ::getClass()
      Sets the lastReturnValue to the class of the element. To access the value
      returned by this method, use the lastReturnValue() method.

    ::addClass(string ClassName)
      Sets the class of the element to the string specified if the element does not
      already have the class applied. Multiple classes can be applied by separating
      with a whitespace character.

    ::removeClass(string ClassNames)
      Removes the classes specified. Separate classes with a space.

    ::noClass()
      Deletes the class attribute.

    ::clearClass()
      Removes all classes from the element by clearing the class attribute.

    ::getStyle(string Style)
      Sets lastReturnValue to the value or null value of the style specified.

    ::getStyle(array Styles)
      Sets lastReturnArray to the values or null values of the styles specified.

    ::setStyle(object Styles)
      Sets the styles specified. Valid input is e.g.
      {width:"100px", fontSize:"25px"}

    ::resetStyle(string Style)
      Resets the style specified to an empty string.

    ::resetStyle(array Styles)
      Resets the styles specified to empty strings.

    ::addChild(elem Child)
    ::appendChild(elem Child)
      Adds the Child element.

    ::removeChild(elem Child)
      Removes the Child element.

    ::getElement()
      Returns the element. Breaks recursivity.

  b) Extensions
    $.c
      The persistence cache; used for plugins.

    $.addPlugin(plugin Plugin, bool Overwrite)
      The function for adding plugins to the object. See Plugin Authoring.

    $.xhttpget(string Url, function Callback)
      Ajax function. If no Callback function is specified, the code waits until the
      request is complete and returns the following:
      [true, [statusCode, responseHeaders, responseText, responseXML]]
      On failure, returns [false, errorMessage]

    $.include(object Resource)
      This function includes css and javascript files into either the head element
      or a code snippet into a target element's innerHTML. Resource must have the
      following properties: { url:string, type:string } Additionally, a snippet must
      have the target element specified in a {target:element} property. For
      snippets, an optional {makediv:bool} property can be set. By default, the
      snippet is enclosed in a div before being passed to the target.
      This extension uses the $.xhttpget extension for snippets.
        Examples: $.include({url:"custom.css",type:"css"})
           $.include({url:"jscript.js", type:"js"})
           $.include({url:"file.html.snippet", type:"snippet",
              target:$("output").getElement()})

    $.hasUnique  .call(object Context, string Property)
      **** DEPRECATED (but still works) ****
      Same as Object.prototype.hasUnique

    Object.prototype.hasUnique (string Property)
      This function returns whether or not a property is unique to the object (i.e.
      not a default property for all objects). This new system greatly simplifies
      usage over the old $.hasUnique.call method, though that method can still be
      called due to the nature of $ being an object.
      
    Array.prototype.hasUnique (string || int)
      Similar to Object.prototype.hasUnique, but specifically for arrays.
      
    String.prototype.strip ()
      Returns String with the whitespace at the beginning and end stripped.
      Formerly String.prototype.stripEndWS. This is actually a dependency for the
      class management methods of the main constructor object.

  c) Plugin Authoring
    i) Plugin Installation
       Plugin authoring is fairly straightforward. To install a plugin, simply pass
      the plugin object to the $.addPlugin function. A typical plugin installation
      looks like this:
        $.addPlugin(myPlgn)
       However, if you already have another version of the plugin installed, you may
      want to overwrite it. This is done by passing a true boolean value as the
      second parameter like so:
        $.addPlugin(myPlgn, true)
       Note that it is good etiquette to surround every plugin istallation in an
      anonymous function that checks for the existence of the $ constructor before
      proceeding with installation, for example:
       (function(w) {
         if (!w.$ && !w.j$){ return; }
         var $ = (typeof w.$.c=="object" && typeof w.$.addPlugin=="function") w.$ : w.j$;
         ...
        })(window);

    ii) Persistence Cache
       The persistence cache allows values and objects to be kept outside the object
      instances. This is useful in many ways, e.g. keeping record of what elements
      were just manipulated. The persistence cache can have methods installed, but
      the cache's purpose is to hold data.
       To access the cache, simply use the $.c object. It is good etiquette to have 
      a single object added to the cache per plugin, and reference everything 
      through that one object, e.g. $.c.myPlgn.cat = "black". It is possible,
      however, for multiple plugins to use the same cache objects. This is a good
      way to conserve memory inside applications.

    iii) Plugin Construction
       Plugins are objects that require two basic things: a name and a function.
      For example, examine the following simple plugin:
        var myPlgn = { name : "myPlgn",
          func : function(name) {
            alert("Hello "+name+"!");
            this.addClass("said-hello");
            return this;
          }};
       As you can see, the plugin function is added to the constructor, so any API
      calls are valid, including calls to the framework private methods in some
      browsers (not working in Chrome as of December 2012).
       To add persistent values, simply add a {persistent} property to the plugin:
        var myPlgn = { name : "myPlgn",
          func : function () { return this; },
          persistent : { myPlgn : {
             property : "value",
             method : function () { return 0; }
            }
           }
       Notice that I intentionally keep all the plugin's persistent values inside a
      single property. This keeps the 1st level recursion of the cache object
      clear for more plugins. You may also want to use the same persistent cache
      values for several plugins. Also note the return statement. Very important
      for recursirvity.
       At the moment, there is no system to update an object in the persistence
      cache without overwriting it. This may be a feature of future versions. If
      you feel up to it, you can rewrite the plugin installation extension yourself.
       I have authored 3 plugins to showcase the (arguably) best way to do this.
      They are $-animation.js, $-betterEvents.js, and $-innerHTML.js, in case you
      are interested. Yes, I am admitting the default event management system kinda
      sucks--for larger, more powerful scripts/web apps, use the betterEvents plugin.
      $-animation.js is very bare, so feel free to beef it up with cooler effects,
      cuz I sure as hell don't have the time right now.

[ == 3. Final Note == ]
 The code is yours to do whatever you wish with it. You can rewrite it, extend it,
write plugin packages for it, or anything else your heart desires. If you come up
with anything you'd like to share, or have any questions, send an email to
k98kurz@gmail.com

 Enjoy
