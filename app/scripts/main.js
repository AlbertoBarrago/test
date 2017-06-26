'use strict';
let searchPlace = 'Amsterdam',
    content = '',
    limitResult = 10,
    records = '',
    radius = 500,
    maxRadius = 800,
    minRadius = 500,
    place = [],
    radiusTemplate = '',
    resultTemplate = '',
    version = '0.0.1 beta';

(function init() {
    fetchData();
    initData();
    userLoggedIn();
    changePlace();
    radiusSlider();
    settedResult();
    filter();
    changePlaceSearched();
})();

function secretData() {
    return {
        clientId: 'E3Q4FASIL55IA2GJGXEEHG5LIOJSQ3VURI2KEYBFJ044XRTK',
        clientSecret: 'N0QHRRZLT2WFREVRP4RF1MLJUJ01YVIQREDRFPIFFY5R4EGX',
        base_api: 'api.foursquare.com/v2/',
        user: 'Alberto Barrago',
        v: 20131124
    }
}

function userLoggedIn() {
    $('#userIn').text(secretData().user); // mocked User
}

function preloader() {
    $('#preloader').fadeOut('slow', function () {
        $(this).remove();
    });
}

function populateFooter() {
    let footerContent = `<p>v${version}</p>`;
    $(footerContent).appendTo('footer');
}

function radiusSlider() {
    $('#outputRadius').text(radius);
    radiusTemplate = `<input class="bar" name="venueRadius" type="range" id="rangeinput" max="${maxRadius}" min="${minRadius}" value="${radius}" 
                      onchange="changeRadius(value)"/>`;
    $(radiusTemplate).appendTo('#radius');
}

function settedResult() {
    $('#outputLimit').text(limitResult);
    resultTemplate = `<input class="bar" name="venueLimit" type="range" id="rangeinput" max="100" min="10" value="${limitResult}" 
                      data-slider-step="10" onchange="changeLimit(value)"/>`;
    $(resultTemplate).appendTo('#resultTemplate');
}

function changeRadius(value) {
    radius = value;
    $('#outputRadius').text(radius);
    cleanList();
    fetchData();
}

function changeLimit(value) {
    limitResult = value;
    $('#outputLimit').text(limitResult);
    cleanList();
    fetchData();
}

function filter() {
    let filterTemplate = `<form class="form-inline">
                      <label class="mr-sm-2" for="inlineFormCustomSelect"></label>
                      <select class="custom-select mb-2 mr-sm-2 mb-sm-0" id="customFilter" onchange="changeFilter()">
                        <option disabled selected value>Filters</option>
                        <option value="food">Food</option>
                        <option value="shops">Shops</option>
                        <option value="outdoors">Outdoors</option>
                        <option value="">All</option>
                      </select>
                    </form>`;

    $(filterTemplate).appendTo('#filter');
}

function changeFilter() {
    records = document.getElementById('customFilter').value;
    cleanList();
    fetchData();
}

function changePlace() {
    let changePlace = `<form class="form-inline my-2 my-lg-0">
                      <input class="form-control mr-sm-2" type="text" id="placeSearched" placeholder="${searchPlace}">
                      <button class="btn btn-outline-success my-2 my-sm-0 searchButton">Search</button>
                    </form>`;

    $(changePlace).appendTo('#changePlace');
}

function changePlaceSearched() {

    $('.searchButton').click(function (e) {
        e.preventDefault();

        if (document.getElementById('placeSearched').value) {
            searchPlace = document.getElementById('placeSearched').value;
            $('#placeSetted').text(searchPlace);
            cleanList();
            fetchData();
        }

    });

}

function initData() {
    if (records = '') {
        records = 'default';
    }

    populateFooter();
}

function cleanList() {
    place = [];
    $('#venues').empty();
}

function fetchData() {

    let secretDatas = secretData();

    const query = 'https://' + secretDatas.base_api + '/venues/explore?near='
        + searchPlace + '&venuePhotos=1&section='
        + records + '&radius='
        + radius + '&limit='
        + limitResult + '&client_id='
        + secretDatas.clientId
        + '&client_secret='
        + secretDatas.clientSecret
        + '&v=' + secretDatas.v;

    preloader();
    $.getJSON(query,
        (data) => {
            try {
                let totalPlace = data.response.groups[0].items,
                    i = 0,
                    maxLengthName = 10,
                    maxLengthStreet = 3;

                if (totalPlace.length > 0) {
                    for (i; i < totalPlace.length; i++) {

                        place.push(data.response.groups[0].items[i].venue);

                        let venueID = place[i].id,
                            street = place[i].location.formattedAddress[0],
                            lat = place[i].location.lat,
                            lng = place[i].location.lng,
                            name = place[i].name,
                            reviews = 'on ' + place[i].ratingSignals + ' reviews',
                            picture_url = place[i].photos.groups[0].items[0].prefix + '100x100' + place[i].photos.groups[0].items[0].suffix,
                            category = place[i].categories[0].name,
                            url = place[i].url,
                            rating = place[i].rating,
                            price = '$';


                        if (rating === undefined) {
                            rating = 'Not Present';
                        }

                        if (url === undefined) {
                            url = 'javascript:void(0)';
                        }

                        if (place[i].ratingSignals === undefined) {
                            reviews = ''
                        }

                        if (place[i].price) {
                            let value = place[i].price.tier;
                            while (value > 1) {
                                price += '$';
                                value--;
                            }
                        } else {
                            price = '';
                        }

                        if (name.length > maxLengthName) {
                            name.substring(0, maxLengthName + 10);
                        }

                        if (street.length > maxLengthStreet) {
                            street.substring(0, maxLengthStreet);
                        }

                        content = `<li class="list-unstyled">
                              <div class="venue-card">
                                <div class="row">
                                    <div class="col-md-2 hidden-sm-down"><img src="${picture_url}" alt="bestImagePlace"></div>
                                    <div class="col-md-9 col-xs-12">
                                        <h4 class="responsiveSize">${street}</h4>
                                        <small><a href="${url}" target="_blank"><i class="fa fa-external-link" aria-hidden="true"></i> Visit Site</a></small>
                                        <div class="review">
                                            Rating: ${rating} ${reviews}
                                        </div>
                                        <p><em class="mainColor">${name}</em> </br> <small>${category}
                                        </small> ${price}
                                            <span class="onSmall hidden-sm-up">
                                         <small> <a href="http://maps.google.com/maps?z=16&t=m&q=loc:${lat}+${lng}" target="_blank()">Explore <i class="fa fa-chevron-right" aria-hidden="true"></i></a> </small>
                                        </span> 
                                        </p>
                                    </div>
                                    <div class="col-md-1 hidden-sm-down chevron">
                                        <a href="http://maps.google.com/maps?z=16&t=m&q=loc:${lat}+${lng}" target="_blank()"><i class="fa fa-chevron-right" aria-hidden="true"></i></a>
                                    </div>
                                </div>
                            </div>
                        </li> <hr class="customHr">`;
                        $(content).prependTo('#venues');

                    }

                    $('#totalVenues').text(totalPlace.length);
                    $('#placeSetted').text(searchPlace);

                } else {
                    content = '<h4 style="text-align: center;"><i class="fa fa-frown-o" aria-hidden="true"></i> Results Not Found</h4>';

                    $(content).appendTo('#venues');
                }
            }
            catch (e) {
                if (window.console) {
                    console.log('*main.js* call to Api has some problems', e);
                }
            }

        })
        .fail(function () {
            if (window.console) {
                console.log('fetch data failed');
            }
        })
}
