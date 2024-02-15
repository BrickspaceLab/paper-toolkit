
Please update the follwing Shopify liquid code to improve the formatting and readability. The code is using Tailwind CSS and Alpine JS. Please format this with a standardized and documented approach.

- Add comments to explain each main section of the code
- Each HTML attribute should be sorted and ordered on a new line based on the importance
- The contents of the class attribute should be indented
- Sort and order standard Tailwind CSS classes on the first indented line of the class attribute
- Liquid variables within class attributes should be moved to the end of the class order on their own line
- All contents within Alpine.js attributes should use standard JavaScript formatting
- Liquid variables with multiple options should be sorted onto new lines for improved readability
- All code should use standard 2 space indentation
- Code comments within the main code block should use liquid {% comment %} tags
- You can skip over the {% schema %} tag in your output

Here is a sample to demostrate class sorting:

```
<section 
  id="{{ section.id }}"
  class="
    relative flex items-center justify-center overflow-hidden
    {{ section.settings.visibility }}
    {{ section.settings.color_scheme }} 
    {{ section.settings.color_border }}
    {{ section.settings.style_border }}
    {% if section.settings.enable_header_overlap %}
      -mt-36
    {% endif %}
  ">
```

Here is a full sample to demostrate ideal formatting:

```
<section 
  id="{{ section.id }}"
  class="
    relative flex items-center justify-center overflow-hidden
    {{ section.settings.visibility }}
    {{ section.settings.color_scheme }} 
    {{ section.settings.color_border }}
    {{ section.settings.style_border }}
    {% if section.settings.enable_header_overlap %}
      -mt-36
    {% endif %}
  ">

  {% comment %} Image background {% endcomment %}
  <div 
    class="
      absolute h-full w-full
      {% unless request.design_mode %}
        {% if settings.enable_animations %}
          scale-200 blur-lg js-animation animation-1000 
        {% endif %}
      {% endunless %}
    "
    {% if settings.enable_animations %}
      data-delay="0" 
      data-replace="{ 
        'scale-200' : 'scale-100',
        'blur-lg' : 'blur-none'
      }"
    {% endif %}>

    {% comment %} Classes for custom image crop {% endcomment %}
    {% assign image_classes = '' %}
    {% if section.settings.show_entire_image %}
      {% assign image_classes = 'hidden md:block object-contain' %}
    {% else %}
      {% assign image_classes = 'hidden md:block object-cover' %}
    {% endif %}

    {% comment %} Toggle to set lazy_loading {% endcomment %}
    {% if section.settings.image_background_desktop %}
      <div 
        class="
          absolute w-full h-full
        ">
        {% render 'component__image',
          image: section.settings.image_background_desktop,
          aspect_ratio: '',
          background: '',
          crop: '',
          max_width: 5760,
          container_class: 'h-full z-10',
          image_class: image_classes,
          enable_lazy_load: section.settings.enable_lazy_loading,
          include_2x: true
        %}
      </div>
    {% endif %}
    {% if section.settings.image_background_mobile == blank %}
      {% if section.settings.image_background_desktop %}
        <div 
          class="
            absolute w-full h-full
          ">
          {% render 'component__image',
            image: section.settings.image_background_desktop,
            aspect_ratio: '',
            background: '',
            crop: 'object-cover',
            max_width: 5760,
            container_class: 'md:hidden w-full h-full z-10',
            image_class: '',
            enable_lazy_load: section.settings.enable_lazy_loading,
            include_2x: true
          %}
        </div>
      {% endif %}
    {% else %}
      <div 
        class="
          absolute w-full h-full
        ">
        {% render 'component__image',
          image: section.settings.image_background_mobile,
          aspect_ratio: '',
          background: '',
          crop: 'object-cover',
          max_width: 900,
          container_class: 'md:hidden w-full h-full z-10',
          image_class: '',
          enable_lazy_load: section.settings.enable_lazy_loading,
          include_2x: true
        %}
      </div>
    {% endif %}
  </div>

  {% comment %} Video background {% endcomment %}
  {% unless section.settings.video_background == blank %}
    <div 
      class="
        absolute top-0 bottom-0 left-0 right-0 z-10
      ">
      {% render 'component__video', 
        video: section.settings.video_background,
        background: '',
        container_class: 'max-w-none md:min-h-full min-w-full h-full',
        video_class: '',
        enable_controls: false,
        enable_autoplay: true,
        enable_loop: true,
        enable_mute_toggle: false
      %}
    </div>
  {% endunless %}

  {% comment %} Banner content {% endcomment %}
  <div 
    class="
      relative z-10 w-full h-full
    "
    {% if section.settings.enable_gradient %}
      style="background: linear-gradient( to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.2) );"
    {% endif %}>

    <div 
      class="
        w-full flex flex-row flex-wrap py-4
        {{ settings.layout_horizontal }}
        {{ section.settings.layout_x_alignment }}
        {{ section.settings.layout_y_alignment }}
        {{ section.settings.layout_y_spacing }}
        {% assign colors = section.settings.color_scheme | split: " " %}{{ colors[1] }}
      ">

      <div 
        class="
          max-w-prose gap-4 flex flex-col
          {% if section.settings.layout_x_alignment contains 'text-center' %}items-center{% endif %}
          {% if section.settings.layout_x_alignment contains 'text-right' %}items-end{% endif %}
          {% if section.settings.enable_background_overlay %}
            p-4 w-full border--radius {{ section.settings.color_scheme }}
          {% endif %}
          {% unless request.design_mode %}
            {% if settings.enable_animations %}
              opacity-0 js-animation animation-300 
            {% endif %}
          {% endunless %}
        "
        {% if settings.enable_animations %}
          data-delay="0" 
          data-replace="{ 
            'opacity-0' : 'opacity-100'
          }"
        {% endif %}>

        {% for block in section.blocks %}
          {% case block.type %}
            {% when 'heading' %}
              <h1 
                class="
                  m-0 
                  {{ section.settings.color_text }}
                " 
                style="
                  padding-top:{{ block.settings.spacing_top }}px;
                  padding-bottom:{{ block.settings.spacing_bottom }}px;
                ">
                {{ block.settings.content }}
              </h1>
            {% when 'content' %}
              <div 
                class="
                  m-0--clear 
                  {{ section.settings.color_text }}
                "
                style="
                  padding-top:{{ block.settings.spacing_top }}px;
                  padding-bottom:{{ block.settings.spacing_bottom }}px;
                ">
                {{ block.settings.content }}
              </div>
            {% when 'buttons' %}
              <div 
                class="
                  md:flex-nowrap flex flex-wrap gap-2
                  {% if section.settings.layout_x_alignment contains 'text-center' %}justify-center{% endif %}
                  {% if section.settings.layout_x_alignment contains 'text-right' %}justify-end{% endif %}
                "
                style="
                  padding-top:{{ block.settings.spacing_top }}px;
                  padding-bottom:{{ block.settings.spacing_bottom }}px;
                ">
                {% unless block.settings.button_url == blank %}
                  <a 
                    href="{{ block.settings.button_url }}" 
                    class="
                      {{ block.settings.color_button }}
                    ">
                    {{ block.settings.button_label }}
                  </a>
                {% endunless %}
                {% unless block.settings.secondary_button_url == blank %}
                  <a 
                    href="{{ block.settings.secondary_button_url }}" 
                    class="
                      {{ block.settings.secondary_color_button }}
                    ">
                    {{ block.settings.secondary_button_label }}
                  </a>
                {% endunless %}
              </div>
          {% endcase %}
        {% endfor %}
        
      </div>
      
    </div>
  </div>

</section>
```